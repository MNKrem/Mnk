# MNK Remodeling — website

## Structure
- `index.html`, `style.css`, `script.js` — the public site
- `admin.html` — **upload page for adding new project photos** (not linked
  from the site's nav — bookmark it directly: yoursite.com/admin.html)
- `projects.json` — the data behind every project card + gallery. You
  normally never edit this by hand anymore — admin.html does it for you.
- `images/projects/<folder>/1.jpg, 2.jpg, ...` — project photos
- `images/logo.jpg` — real MNK Remodeling logo (header/footer/favicon)
- `functions/api/quote.js` — quote form -> MNK's own Telegram bot
- `functions/api/ai-design.js` — AI Design Preview backend (Google Gemini
  2.5 Flash Image / "Nano Banana")
- `functions/api/upload-photo.js` — backend for admin.html: commits
  photos + updated projects.json straight to this GitHub repo

## Adding project photos (for your friend — no coding)
1. Go to yoursite.com/admin.html
2. Enter the admin key
3. Pick "Add to existing project" (choose from dropdown) or
   "Start a new project" (pick a service, type a title)
4. Choose one or more photos, hit Upload
Done — it commits directly to GitHub. If this Pages project is connected
via Git (see Deploy below), the live site redeploys itself automatically,
usually within a minute.

## One-time setup for the upload page to work
This requires the site to be deployed via a GitHub repo connected to
Cloudflare Pages (Git integration), not drag-and-drop upload — the
upload page commits directly to that repo.

1. Push this whole folder to a GitHub repo (create one if you don't have
   it yet: github.com -> New repository)
2. Cloudflare Pages -> your project -> Settings -> Builds & deployments
   -> connect it to that GitHub repo (or create the Pages project fresh
   via "Connect to Git" instead of "Upload assets")
3. Create a GitHub Personal Access Token:
   github.com/settings/tokens -> "Fine-grained tokens" -> Generate new
   -> restrict it to this ONE repository -> under "Repository permissions"
   set Contents = Read and write -> Generate, copy the token
4. Cloudflare Pages -> Settings -> Environment variables -> add
   (Production AND Preview):
   - GITHUB_TOKEN   = the token from step 3
   - GITHUB_REPO    = your-github-username/your-repo-name
   - GITHUB_BRANCH  = main (or whatever branch Pages deploys from)
   - ADMIN_KEY      = make up any password — this is what admin.html asks for
   - TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID  (for the quote form)
   - GEMINI_API_KEY  (for AI Design Preview)
5. Redeploy after adding the variables

## First-pass photo grouping — please sanity-check
I grouped your ~90 photos into 11 projects by what looked like the same
room across consecutive camera-roll shots. I could not tell which
specific client/address each belongs to, or whether any grouping
actually mixes two different jobs — the files were just a continuous
timestamped dump with no other labels. Generic titles like "Guest Bath
Update" are placeholders. Easiest fix now: open admin.html, and for
anything mislabeled, it's simplest to just leave the existing entry as
extra photos of "whatever project it's closest to" going forward, and
rename titles/locations by editing projects.json directly (plain text,
still easy) for the historical batch.

## Before going live
- Phone/email placeholders in the footer/contact section — update them
- Basement/Whole-Home have no real projects yet — add via admin.html once
  there are photos
