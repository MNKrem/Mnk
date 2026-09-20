# MNK Remodeling — website

## Structure
- `index.html`, `style.css`, `script.js` — the site
- `images/` — real project photos (see images/README.md — bathroom, flooring
  and carpentry have real photos; kitchen/basement/whole-home are still
  placeholders until real photos exist)
- `images/logo.jpg` — real MNK Remodeling logo, used in header/footer/favicon
- `functions/api/quote.js` — receives the quote form, sends it to MNK's own Telegram bot
- `functions/api/ai-design.js` — AI Design Preview backend (Google Gemini 2.5 Flash Image / "Nano Banana")

Both `functions/api/*` files are Cloudflare Pages Functions — they deploy
automatically as part of this same project. No separate Worker, no
separate URL, no separate account.

## Deploy
1. Cloudflare Dashboard -> Workers & Pages -> Create -> Pages -> Upload assets
   (or connect this folder as a Git repo for auto-deploy on push)
2. Upload everything in this folder (keep the `functions/` folder structure intact)
3. Settings -> Environment variables -> add (Production AND Preview):
   - TELEGRAM_BOT_TOKEN   (from @BotFather in Telegram — a NEW bot for
     this project, separate from any other project's bot)
   - TELEGRAM_CHAT_ID     (see comment at the top of functions/api/quote.js
     for how to find it)
   - GEMINI_API_KEY       (free, no card, from aistudio.google.com/apikey)
4. Redeploy after adding the variables (they only apply to deploys made
   after they're set)

## Before going live
- Phone/email in the footer and contact section are placeholders — update them
- Kitchen/Basement/Whole-Home still need real photos (see images/README.md)
- Photo file sizes: real iPhone photos, 100-250KB each, ~90 total in the
  folder you sent — fine for the web as-is, but worth running through an
  image compressor (e.g. squoosh.app) before final launch if page load
  speed matters
