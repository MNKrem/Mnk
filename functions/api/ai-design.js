/**
 * Cloudflare Pages Function — POST /api/ai-design
 * Same Gemini 2.5 Flash Image ("Nano Banana") logic as the standalone
 * worker, just living inside the site's own Pages project so there's
 * only ONE Cloudflare deploy, ONE URL, and no separate WORKER_URL.
 *
 * SETUP:
 * Cloudflare Pages project -> Settings -> Environment variables ->
 * add (Production AND Preview):
 *   GEMINI_API_KEY = <key from aistudio.google.com/apikey, free, no card>
 * Redeploy.
 */

const MODEL = "gemini-2.5-flash-image";

function buildPrompts(roomType) {
  const room = (roomType || "room").replace("_", " ");
  return [
    {
      style: "scandinavian_minimalist",
      label: "Scandinavian Minimalist",
      prompt: `Redesign this ${room} in a Scandinavian minimalist style: light wood tones, white walls, clean simple lines, soft natural light. Keep the exact same room layout, windows, doors, and camera angle — only change the finishes, fixtures, and decor.`,
    },
    {
      style: "modern_luxury",
      label: "Modern Luxury",
      prompt: `Redesign this ${room} in a modern luxury style: marble or quartz surfaces, matte black fixtures, warm ambient lighting. Keep the exact same room layout, windows, doors, and camera angle — only change the finishes, fixtures, and decor.`,
    },
    {
      style: "farmhouse_chic",
      label: "Farmhouse Chic",
      prompt: `Redesign this ${room} in a farmhouse chic style: shiplap or beadboard walls, warm wood accents, vintage-inspired fixtures. Keep the exact same room layout, windows, doors, and camera angle — only change the finishes, fixtures, and decor.`,
    },
  ];
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.GEMINI_API_KEY) {
    return json({ error: "Server is missing GEMINI_API_KEY." }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be JSON." }, 400);
  }

  const { image, roomType } = body || {};
  if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
    return json({ error: "Missing/invalid 'image' (expected a data:image/... base64 URI)." }, 400);
  }

  const mimeType = image.slice(5, image.indexOf(";"));
  const base64Data = image.slice(image.indexOf(",") + 1);
  const jobs = buildPrompts(roomType);

  try {
    const variants = await Promise.all(
      jobs.map((job) => generateOne(env.GEMINI_API_KEY, mimeType, base64Data, job))
    );
    return json({ variants }, 200);
  } catch (err) {
    return json({ error: err.message || "Generation failed." }, 502);
  }
}

export async function onRequest(context) {
  if (context.request.method === "POST") return onRequestPost(context);
  return json({ error: "Use POST." }, 405);
}

async function generateOne(apiKey, mimeType, base64Data, job) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: job.prompt },
            { inline_data: { mime_type: mimeType, data: base64Data } },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const text = await safeText(res);
    throw new Error(`[${job.style}] Gemini request failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p) => p.inlineData || p.inline_data);
  const inline = imgPart && (imgPart.inlineData || imgPart.inline_data);

  if (!inline) {
    throw new Error(`[${job.style}] No image in response (model may have refused or returned text only).`);
  }

  const outMime = inline.mimeType || inline.mime_type || "image/png";
  const dataUri = `data:${outMime};base64,${inline.data}`;

  return { style: job.style, label: job.label, url: dataUri };
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
