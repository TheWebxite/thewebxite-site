import { NextResponse } from "next/server";
import { SERVICES } from "@/data/services";

/**
 * Where an enquiry actually goes.
 *
 * IT FORWARDS TO A WEBHOOK, AND THAT IS A DELIBERATE CHOICE OF STACK.
 * The studio already runs Zapier and n8n — they are on the Tech Partners
 * row — and both take an inbound webhook and fan it out to email, Lark,
 * a sheet, a CRM, whatever the client later decides. Hard-coding one
 * email provider here would mean an API key, a vendor, and a decision
 * that is not ours to make. One environment variable, ENQUIRY_WEBHOOK_URL,
 * and it is wired.
 *
 * WITH NO WEBHOOK SET IT SAYS SO, PLAINLY. It does not pretend to have
 * sent anything. The page always shows the email address and the phone
 * numbers beside the form, so the guaranteed route is never hidden
 * behind a form that might be a dead end.
 *
 * IT WORKS WITHOUT JAVASCRIPT. A browser posting a plain form sends
 * Accept: text/html, and gets a redirect back to /contact with a state
 * in the query string. A fetch sends Accept: application/json and gets
 * JSON. Same validation either way, because the client-side kind is a
 * convenience and never the enforcement.
 */

/** Generous, but bounded: these are the sizes past which a submission is
 *  not a message, it is an attack or a paste accident. */
const LIMITS = { name: 120, email: 200, phone: 60, company: 160, message: 4000 } as const;

const CHOICES = [...SERVICES.map((s) => s.deckName), "Not sure yet"];

type Fields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  need: string;
  message: string;
};

function validate(f: Fields): string | null {
  if (!f.name.trim()) return "Please tell us your name.";
  if (!f.email.trim()) return "Please leave an email address so we can reply.";
  /* Deliberately loose. Anything stricter rejects real addresses, and the
     only true test of an address is sending to it. */
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return "That email address does not look right.";
  if (!f.message.trim()) return "Please tell us what you need.";
  for (const [k, max] of Object.entries(LIMITS)) {
    if ((f[k as keyof Fields] ?? "").length > max) return "That message is longer than this form can take.";
  }
  if (f.need && !CHOICES.includes(f.need)) return "Please choose one of the listed options.";
  return null;
}

export async function POST(request: Request) {
  const form = await request.formData();
  const get = (k: string) => String(form.get(k) ?? "").trim();

  /* Honeypot: a field no person sees and every naive bot fills. Answer
     200 so the bot believes it worked and does not come back to retry. */
  if (get("website")) return done(request, "ok");

  const fields: Fields = {
    name: get("name"),
    email: get("email"),
    phone: get("phone"),
    company: get("company"),
    need: get("need"),
    message: get("message"),
  };

  const problem = validate(fields);
  if (problem) return done(request, "invalid", problem, 400);

  const hook = process.env.ENQUIRY_WEBHOOK_URL;
  if (!hook) {
    /* Honest failure. Nothing was sent and the visitor is told so,
       rather than being thanked for a message nobody will read. */
    return done(
      request,
      "unconfigured",
      "This form is not connected yet — please email or call us instead.",
      503,
    );
  }

  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...fields, receivedAt: new Date().toISOString(), source: "thewebxite.com/contact" }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  } catch {
    return done(request, "failed", "Something went wrong sending that — please email or call us instead.", 502);
  }

  return done(request, "ok");
}

/** One answer, two shapes: a redirect for a plain form post, JSON for a
 *  fetch. The browser tells us which by what it will accept. */
function done(request: Request, state: string, message?: string, status = 200) {
  const wantsHtml = (request.headers.get("accept") ?? "").includes("text/html");
  if (wantsHtml) {
    const url = new URL("/contact", request.url);
    url.searchParams.set("sent", state);
    url.hash = "enquiry";
    /* 303: the next request must be a GET, so a refresh cannot resubmit. */
    return NextResponse.redirect(url, 303);
  }
  return NextResponse.json({ state, message }, { status });
}
