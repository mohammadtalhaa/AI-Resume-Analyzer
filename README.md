# ResumeScan

An AI-powered resume analyzer: ATS scoring, job-description matching, bullet/achievement
rewriting, STAR-method checking, keyword density, recruiter simulation questions, salary
prediction, a live GitHub portfolio scanner, resume-vs-resume comparison, and a follow-up
chat — all in a single static site you can host for free on GitHub Pages.

Accepts resumes as pasted text, `.txt`, `.pdf`, or `.docx` (parsed entirely in the browser).

## How it works — important

This is a **static, backend-less site**. The AI analysis calls the Anthropic API
**directly from the visitor's browser**, using an API key they enter themselves (stored
only in their own browser's local storage, in the "Set API key" button top-right). Nothing
is sent to any server you control.

This means:
- **You don't pay for other people's usage** — each visitor uses their own key.
- **Anyone using the page needs their own Anthropic API key** from
  [console.anthropic.com](https://console.anthropic.com/settings/keys).
- A browser key is inherently visible to anyone with dev tools open on that browser. Don't
  point people to this page and ask them to paste in a key you don't want exposed. This is
  fine for a personal tool or portfolio demo; it is **not** a pattern for a product with
  paying users — that needs a real backend that holds the key server-side.
- The GitHub portfolio tab needs no key — it hits GitHub's public REST API directly.

If you'd rather ship this as a real product where you control the key and usage, the
Anthropic API call in `src/App.jsx` (`callClaude`) needs to move behind your own backend
(a small serverless function that holds the key and proxies the request) instead of firing
from the browser.

## Local development

```bash
npm install
npm run dev
```

Open the printed local URL, click **Set API key**, paste an Anthropic key, and try a scan.

## Deploy to GitHub Pages

**Option A — automatic (recommended):** this repo includes
`.github/workflows/deploy.yml`. Push to `main`, then in your repo settings go to
**Settings → Pages → Source** and select **GitHub Actions**. Every push to `main`
rebuilds and redeploys automatically. Your site will be live at
`https://<your-username>.github.io/<repo-name>/`.

**Option B — manual, from your machine:**

```bash
npm install
npm run deploy
```

This uses the `gh-pages` package to push a production build to a `gh-pages` branch. Then
set **Settings → Pages → Source → Deploy from a branch → gh-pages**.

No config changes are needed for either option — `vite.config.js` uses a relative base
path (`base: "./"`) so the build works regardless of the repo name or subpath it's served
from.

## Tech

- React 18 + Vite
- `pdfjs-dist` for client-side PDF text extraction
- `mammoth` for client-side `.docx` text extraction
- `lucide-react` for icons
- No state management library, no CSS framework — plain CSS in `src/styles.css`

## Project structure

```
resume-scan/
├── src/
│   ├── App.jsx          # all app logic + UI
│   ├── fileParsing.js   # .txt / .pdf / .docx → text
│   ├── main.jsx         # React entry point
│   └── styles.css
├── index.html
├── vite.config.js
├── package.json
└── .github/workflows/deploy.yml
```
