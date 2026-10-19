"use client";

import { useState } from "react";
import { SERVICES } from "@/data/services";

/**
 * The enquiry form.
 *
 * IT IS A REAL FORM FIRST AND A SCRIPT SECOND. method="post" action="…"
 * means it submits and gets an answer with JavaScript off; the handler
 * below only intercepts to keep the reader on the page. Nothing is
 * validated here that is not also validated on the server — see
 * app/api/enquiry/route.ts — because client-side validation is a
 * courtesy, never the gate.
 *
 * NO BUDGET BANDS. Every comparable form has them and they are the
 * reason prospects self-qualify, but the bands would be a public
 * statement of what this studio charges, and no figure exists to base
 * them on. Asking "what do you need" is a question; offering
 * "RM5,000-15,000" is a claim. Logged in FOLLOW-UPS.
 *
 * The honeypot is a field positioned off-screen rather than
 * display:none — some bots skip hidden inputs — labelled and
 * aria-hidden so nothing announces it to a person.
 */

const CHOICES = [...SERVICES.map((s) => s.deckName), "Not sure yet"];

type State = "idle" | "sending" | "ok" | "error";

const FIELD =
  "mt-2 w-full border border-hairline-ink bg-surface px-4 py-3 text-ink outline-none placeholder:text-ink-muted/70 focus-visible:border-canvas focus-visible:ring-2 focus-visible:ring-canvas";
const LABEL = "block text-xs uppercase tracking-[0.16em] text-ink-muted";

export default function EnquiryForm({ initialState }: { initialState?: string }) {
  /* A plain-form submission comes back as ?sent=… ; a scripted one sets
     this itself. Both land in the same place. */
  const [state, setState] = useState<State>(
    initialState === "ok" ? "ok" : initialState && initialState !== "idle" ? "error" : "idle",
  );
  const [message, setMessage] = useState<string>(
    initialState && initialState !== "ok" && initialState !== "idle"
      ? "That did not send — please email or call us instead."
      : "",
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    setMessage("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { accept: "application/json" },
        body: new FormData(form),
      });
      const data = (await res.json()) as { state: string; message?: string };
      if (res.ok && data.state === "ok") {
        setState("ok");
        form.reset();
      } else {
        setState("error");
        setMessage(data.message ?? "That did not send — please email or call us instead.");
      }
    } catch {
      setState("error");
      setMessage("That did not send — please email or call us instead.");
    }
  }

  if (state === "ok") {
    return (
      <p
        role="status"
        className="border border-hairline-ink bg-surface p-8 text-lead leading-[1.5]"
      >
        Thank you — that is with us. We will come back to you.
      </p>
    );
  }

  return (
    <form id="enquiry" method="post" action="/api/enquiry" onSubmit={onSubmit} className="min-w-0">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="min-w-0">
          <label className={LABEL} htmlFor="name">
            Your name
          </label>
          <input id="name" name="name" required maxLength={120} autoComplete="name" className={FIELD} />
        </div>
        <div className="min-w-0">
          <label className={LABEL} htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required maxLength={200} autoComplete="email" className={FIELD} />
        </div>
        <div className="min-w-0">
          <label className={LABEL} htmlFor="phone">
            Phone <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="phone" name="phone" type="tel" maxLength={60} autoComplete="tel" className={FIELD} />
        </div>
        <div className="min-w-0">
          <label className={LABEL} htmlFor="company">
            Company <span className="normal-case tracking-normal">(optional)</span>
          </label>
          <input id="company" name="company" maxLength={160} autoComplete="organization" className={FIELD} />
        </div>
      </div>

      <div className="mt-6">
        <label className={LABEL} htmlFor="need">
          What do you need?
        </label>
        {/* The six solutions, named exactly as the rest of the site names
            them, plus the honest option. */}
        <select id="need" name="need" defaultValue="Not sure yet" className={FIELD}>
          {CHOICES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6">
        <label className={LABEL} htmlFor="message">
          What is slow?
        </label>
        <textarea id="message" name="message" required rows={6} maxLength={4000} className={`${FIELD} resize-y`} />
      </div>

      {/* Honeypot. Off-screen rather than hidden, and never announced. */}
      <div aria-hidden="true" className="absolute left-0 top-0 h-px w-px overflow-hidden [clip-path:inset(50%)] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex min-h-[48px] items-center bg-canvas px-7 text-sm uppercase tracking-[0.16em] text-text transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send it"}
        </button>
        {state === "error" ? (
          <p role="alert" className="max-w-[38ch] text-base text-ink">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
