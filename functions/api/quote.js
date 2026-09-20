/**
 * Cloudflare Pages Function — POST /api/quote
 * Receives the quote-request form and forwards it to MNK Remodeling's
 * own Telegram bot (separate from any other project's bot/token).
 *
 * SETUP:
 * 1. In Telegram, message @BotFather -> /newbot -> follow the prompts.
 *    You'll get a token like 123456:ABC-DEF...
 * 2. Message your new bot once (anything), then open in a browser:
 *    https://api.telegram.org/bot<YOUR_TOKEN>/getUpdates
 *    Find "chat":{"id": ...} in the response — that's your TELEGRAM_CHAT_ID.
 *    (If you want it in a group instead, add the bot to the group first,
 *    send a message there, then check getUpdates the same way.)
 * 3. Cloudflare Pages project -> Settings -> Environment variables ->
 *    add (Production AND Preview):
 *      TELEGRAM_BOT_TOKEN = 123456:ABC-DEF...
 *      TELEGRAM_CHAT_ID   = 123456789
 * 4. Redeploy. That's it — no separate Worker, this lives in the same
 *    Pages project as the site.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
    return json({ error: "Server is missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be JSON." }, 400);
  }

  const name = (body.name || "").toString().slice(0, 200);
  const phone = (body.phone || "").toString().slice(0, 60);
  const service = (body.service || "").toString().slice(0, 120);
  const message = (body.message || "").toString().slice(0, 2000);

  if (!name || !phone) {
    return json({ error: "Name and phone are required." }, 400);
  }

  const text =
    `🛠️ New MNK Remodeling quote request\n\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Service: ${service || "—"}\n` +
    `Details: ${message || "—"}`;

  const tgRes = await fetch(
    `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text }),
    }
  );

  if (!tgRes.ok) {
    const errText = await safeText(tgRes);
    return json({ error: `Telegram delivery failed: ${errText}` }, 502);
  }

  return json({ ok: true }, 200);
}

// Any method other than POST -> 405
export async function onRequest(context) {
  if (context.request.method === "POST") return onRequestPost(context);
  return json({ error: "Use POST." }, 405);
}

async function safeText(res) {
  try {
    return await res.text();
  } catch {
    return "(no body)";
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
