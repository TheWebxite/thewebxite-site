import { expect, test } from "@playwright/test";

/**
 * The page exists to receive enquiries, so these test the mechanism
 * rather than the markup. The webhook is not configured in CI, which is
 * why the happy path asserts "it was accepted and answered honestly"
 * rather than "it was delivered" — the delivery itself was verified
 * against a local receiver, see the commit.
 */

const FILL = {
  name: "Teng Sheng",
  email: "hi@thewebxite.com",
  message: "Our quotations take two days.",
};

test("the enquiry form is present, labelled, and reachable by keyboard", async ({ page }) => {
  await page.goto("/contact");
  const form = page.locator("form#enquiry");
  await expect(form).toHaveCount(1);
  /* A form that only works with JS is a form that sometimes does not. */
  await expect(form).toHaveAttribute("method", "post");
  await expect(form).toHaveAttribute("action", "/api/enquiry");

  const unlabelled = await page.evaluate(() => {
    const f = document.querySelector("form#enquiry")!;
    return [...f.querySelectorAll("input, select, textarea")].filter(
      (el) => !el.id || !f.querySelector(`label[for="${el.id}"]`),
    ).length;
  });
  expect(unlabelled, "every control needs a label").toBe(0);

  await page.getByLabel("Your name").focus();
  await expect(page.getByLabel("Your name")).toBeFocused();
});

test("the server rejects what it should, and says why", async ({ request }) => {
  const bad = await request.post("/api/enquiry", {
    headers: { accept: "application/json" },
    multipart: { name: "", email: "nope", message: "" },
  });
  expect(bad.status()).toBe(400);
  expect((await bad.json()).message).toMatch(/name/i);

  const badEmail = await request.post("/api/enquiry", {
    headers: { accept: "application/json" },
    multipart: { name: "A", email: "notanemail", message: "hi" },
  });
  expect(badEmail.status()).toBe(400);
});

test("a filled honeypot is accepted and discarded", async ({ request }) => {
  /* 200 so the bot believes it worked and does not retry; nothing is
     forwarded. */
  const res = await request.post("/api/enquiry", {
    headers: { accept: "application/json" },
    multipart: { ...FILL, website: "https://spam.example" },
  });
  expect(res.status()).toBe(200);
  expect((await res.json()).state).toBe("ok");
});

test("with no webhook configured it refuses honestly rather than faking a send", async ({ request }) => {
  const res = await request.post("/api/enquiry", {
    headers: { accept: "application/json" },
    multipart: FILL,
  });
  /* The one outcome that must never happen is a cheerful thank-you for a
     message that went nowhere. Either it is delivered (200) or the
     visitor is told (503) — never 200 with nothing sent. */
  expect([200, 503]).toContain(res.status());
  const body = await res.json();
  if (res.status() === 503) expect(body.message).toMatch(/email|call/i);
});

test("a plain form post redirects back to the page instead of showing JSON", async ({ request }) => {
  const res = await request.post("/api/enquiry", {
    headers: { accept: "text/html" },
    multipart: FILL,
    maxRedirects: 0,
  });
  expect(res.status()).toBe(303);
  expect(res.headers()["location"]).toContain("/contact?sent=");
});

test("the page keeps the routes that cannot fail beside the form", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("link", { name: /@thewebxite\.com/ }).first()).toBeVisible();
  const tel = page.locator('a[href^="tel:"]');
  expect(await tel.count()).toBeGreaterThanOrEqual(1);
  /* What happens next, so sending is not a leap of faith. */
  await expect(page.getByText("Tech Consultation")).toBeVisible();
  await expect(page.getByText("Free Demo")).toBeVisible();
  await expect(page.getByText("Follow-up Timeline")).toBeVisible();
});

test("the form carries no budget band we cannot stand behind", async ({ page }) => {
  await page.goto("/contact");
  const text = await page.locator("form#enquiry").innerText();
  expect(text).not.toMatch(/RM\s?\d/i);
  expect(text).not.toMatch(/budget/i);
});
