// Netlify serverless proxy for the contact form.
//
// Why: posting directly from the browser to Apps Script needs `no-cors` (Google
// sends no CORS headers), which makes the response opaque AND drops the body on
// Google's 302 redirect — so the front could only *assume* success. Routing
// through this same-origin function removes CORS entirely: the browser POSTs
// here, and we relay to Apps Script server-side where the redirect + response
// are followed normally, so we can return the REAL result to the client.
//
// Config: set GOOGLE_SCRIPT_URL in Netlify env (Site settings → Environment).
// Falls back to the build-time VITE_GOOGLE_SCRIPT_URL if present.

const SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL || process.env.VITE_GOOGLE_SCRIPT_URL || "";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { result: "error", reason: "method_not_allowed" });
  }
  if (!SCRIPT_URL) {
    return json(500, { result: "error", reason: "endpoint_not_configured" });
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { result: "error", reason: "bad_json" });
  }

  const name = (data.name || "").toString().trim();
  const email = (data.email || "").toString().trim();
  const subject = (data.subject || "").toString().trim();
  const message = (data.message || "").toString().trim();
  const honeypot = (data.company || "").toString().trim(); // bot trap

  // Silently accept bot submissions (don't relay) — looks like success to them.
  if (honeypot) return json(200, { result: "success" });

  if (!name || !email || !message) {
    return json(422, { result: "error", reason: "missing_fields" });
  }
  // Basic email sanity check.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(422, { result: "error", reason: "bad_email" });
  }

  try {
    // Relay server-side. fetch follows the 302 redirect and keeps the body, so
    // Apps Script's doPost runs and we can read its JSON verdict.
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, subject, message }),
      redirect: "follow",
    });

    const text = await res.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Non-JSON body from Apps Script → treat as failure rather than fake success.
      return json(502, { result: "error", reason: "bad_upstream_response" });
    }

    if (parsed.result === "success") return json(200, { result: "success" });
    return json(502, { result: "error", reason: parsed.reason || "upstream_error" });
  } catch (err) {
    return json(502, { result: "error", reason: String(err) });
  }
};
