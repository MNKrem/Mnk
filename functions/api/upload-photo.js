/**
 * MNK Remodeling — Admin photo upload backend
 * Cloudflare Pages Function: POST /api/upload-photo
 *
 * Takes a photo + project info from admin.html and commits it straight
 * to the site's GitHub repo:
 *   1. Writes the photo file to images/projects/<folder>/<n>.jpg
 *   2. Updates projects.json (new project entry, or bumps an existing
 *      project's photo count)
 * If this Cloudflare Pages project is connected to that repo via Git,
 * both commits trigger an automatic redeploy — the site updates itself
 * within about a minute, no manual redeploy needed.
 *
 * SETUP (Cloudflare Pages project -> Settings -> Environment variables,
 * add to BOTH Production and Preview):
 *   GITHUB_TOKEN   - a GitHub Personal Access Token with "Contents:
 *                    read and write" permission on this one repo.
 *                    Create at github.com/settings/tokens ->
 *                    "Fine-grained tokens" -> select this repository only
 *                    -> Repository permissions -> Contents -> Read and write.
 *   GITHUB_REPO    - "your-github-username/your-repo-name"
 *   GITHUB_BRANCH  - usually "main" (whatever branch Pages deploys from)
 *   ADMIN_KEY      - any password you make up; admin.html asks for this
 *                    before it will upload anything. Not high-security —
 *                    good enough to stop a random visitor from finding
 *                    the page and spamming uploads, since the real
 *                    write access (GITHUB_TOKEN) never reaches the browser.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  for (const name of ["GITHUB_TOKEN", "GITHUB_REPO", "ADMIN_KEY"]) {
    if (!env[name]) return json({ error: `Server is missing ${name}.` }, 500);
  }
  const branch = env.GITHUB_BRANCH || "main";

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be JSON." }, 400);
  }

  if (body.adminKey !== env.ADMIN_KEY) {
    return json({ error: "Wrong admin key." }, 401);
  }

  const { mode, photo } = body;
  if (!photo || typeof photo !== "string" || !photo.startsWith("data:image/")) {
    return json({ error: "Missing/invalid 'photo' (expected a data:image/... base64 URI)." }, 400);
  }
  const mime = photo.slice(5, photo.indexOf(";"));
  const ext = mime === "image/png" ? "png" : "jpg";
  const base64 = photo.slice(photo.indexOf(",") + 1);

  const gh = new GitHub(env.GITHUB_TOKEN, env.GITHUB_REPO, branch);

  try {
    // 1. Load the current projects.json (need its sha to update it)
    const { content: projectsFile, sha: projectsSha } = await gh.getFile("projects.json");
    const projects = JSON.parse(projectsFile);

    let folder, nextIndex, projectTitle;

    if (mode === "existing") {
      const project = projects.find(p => p.folder === body.folder);
      if (!project) return json({ error: `Project folder '${body.folder}' not found.` }, 404);
      folder = project.folder;
      nextIndex = project.count + 1;
      project.count = nextIndex;
      project.ext = ext; // keep in sync with whatever was just uploaded
      projectTitle = project.title;
    } else if (mode === "new") {
      const { service, title, location } = body;
      if (!service || !title) return json({ error: "New project needs a service and a title." }, 400);
      folder = uniqueSlug(title, projects.map(p => p.folder));
      nextIndex = 1;
      projects.push({ service, title, location: location || "", folder, count: 1, ext });
      projectTitle = title;
    } else {
      return json({ error: "mode must be 'existing' or 'new'." }, 400);
    }

    // 2. Commit the photo file
    await gh.putFile(
      `images/projects/${folder}/${nextIndex}.${ext}`,
      base64,
      `Add photo ${nextIndex} to ${projectTitle}`
    );

    // 3. Commit the updated projects.json
    const updatedContent = JSON.stringify(projects, null, 2) + "\n";
    await gh.putFile(
      "projects.json",
      b64encode(updatedContent),
      `Update projects.json for ${projectTitle}`,
      projectsSha
    );

    return json({
      ok: true,
      folder,
      photoIndex: nextIndex,
      project: projectTitle,
      note: "Committed to GitHub. If Pages is Git-connected, the live site updates in about a minute."
    }, 200);
  } catch (err) {
    return json({ error: err.message || "Upload failed." }, 502);
  }
}

export async function onRequest(context) {
  if (context.request.method === "POST") return onRequestPost(context);
  return json({ error: "Use POST." }, 405);
}

/* ---------------- tiny GitHub Contents API client ---------------- */
class GitHub {
  constructor(token, repo, branch) {
    this.token = token;
    this.repo = repo; // "owner/name"
    this.branch = branch;
  }
  async getFile(path) {
    const res = await fetch(`https://api.github.com/repos/${this.repo}/contents/${path}?ref=${this.branch}`, {
      headers: this._headers()
    });
    if (!res.ok) throw new Error(`GitHub read failed for ${path}: ${await safeText(res)}`);
    const data = await res.json();
    return { content: atob(data.content.replace(/\n/g, "")), sha: data.sha };
  }
  async putFile(path, base64Content, message, sha) {
    const res = await fetch(`https://api.github.com/repos/${this.repo}/contents/${path}`, {
      method: "PUT",
      headers: this._headers(),
      body: JSON.stringify({
        message,
        content: base64Content,
        branch: this.branch,
        ...(sha ? { sha } : {})
      })
    });
    if (!res.ok) throw new Error(`GitHub write failed for ${path}: ${await safeText(res)}`);
    return res.json();
  }
  _headers() {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "mnk-remodeling-admin-upload"
    };
  }
}

function uniqueSlug(title, existingFolders) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "project";
  let slug = base;
  let n = 2;
  while (existingFolders.includes(slug)) {
    slug = `${base}-${n}`;
    n++;
  }
  return slug;
}

function b64encode(str) {
  // btoa only handles Latin1; this covers UTF-8 text like project titles.
  return btoa(unescape(encodeURIComponent(str)));
}

async function safeText(res) {
  try { return await res.text(); } catch { return "(no body)"; }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
