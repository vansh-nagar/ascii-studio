# ASCII Studio

**Turn videos and images into ASCII art you can style, export, and use on the web.**

[Open the studio](https://asciistudio.space/tool/studio) · [Explore the showcase](https://asciistudio.space/showcase) · [Run locally](#run-locally) · [Contribute](#contributing)

![ASCII Studio editor showing a media preview and customization controls](https://github.com/user-attachments/assets/1f2b3c3e-c98c-49e1-9347-c0a64d070608)

ASCII Studio converts media into character-based frames in your browser. Adjust the character ramp, density, luminance threshold, and appearance, then export an image, a WebM animation, or a React component.

## What you can make

- **ASCII images and animations** from MP4, WebM, MOV, PNG, JPEG, WebP, and GIF inputs, subject to browser decoding support.
- **Custom looks** with character presets, inverted ramps, colors, typography, and effects.
- **Reusable outputs** as images, canvas-recorded WebM video, or React source with embedded frames.
- **More visual experiments** with pixel distortion, pixel sorting, dithering, halftone, and mesh-gradient tools under `/tool`.

[Watch the demo](https://github.com/user-attachments/assets/1537e97a-ff49-42f6-8d42-dd3fcdaa280f)

## Run locally

### Requirements

- Node.js **20.9 or newer**; the development launcher runs through Node.
- Bun **1.3.14**, matching the root `packageManager` field and committed `bun.lock`.
- A desktop browser with Canvas 2D support. The ASCII editor currently shows a mobile gate at viewport widths of 768px or less.

```sh
git clone https://github.com/vansh-nagar/ascii-studio.git
cd ascii-studio
bun install --frozen-lockfile
bun run dev
```

Open the URL printed by the launcher (normally `http://localhost:3000`), then visit `/tool/studio`. If port 3000 is occupied, the launcher searches the next 99 ports and reports the selected URL. It exits with an error if the entire range is unavailable.

**No API keys or environment variables are required for the public studio.** The optional showcase administration dashboard has separate configuration; see [administration](#optional-showcase-administration).

### Commands

Run these from the repository root unless otherwise noted:

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start development through Turborepo, using webpack and polling |
| `bun run build` | Build the Next.js application for production |
| `bun run start` | Serve the production build; run `build` first |
| `bun run lint` | Run the application's ESLint checks |
| `bun run test` | Run development-launcher regression tests with Node's test runner |
| `node --test scripts/dev.test.mjs` | Run those tests without installing dependencies |

For a custom development port or Next.js flags, run the launcher from the app directory:

```sh
cd apps/landing
node ../../scripts/dev.mjs --base 4000 --webpack
```

The launcher defaults `WATCHPACK_POLLING` to `true` and respects an explicitly supplied value. `bun run dev:turbo` from `apps/landing` runs `next dev` directly, bypassing the custom launcher.

## How it works

The app uses **Next.js 16, React 19, TypeScript, and Tailwind CSS 4**, with Bun workspaces and Turborepo for development and builds.

1. Browser media APIs decode the selected local file.
2. Canvas samples frames at the chosen character-grid size. The processor maps pixel luminance onto a character ramp and adjusts row count for the font's aspect ratio.
3. The studio previews and styles the generated text frames.
4. Export utilities render frames to an image or a canvas stream, or embed them in a React component.

The conversion path is client-side and does not require a conversion server. The site still uses network resources such as fonts and analytics; this is not an offline-only application.

### Practical limits

| Area | Current behavior and tradeoff |
| --- | --- |
| Input video | The browser must decode the actual codec, not just recognize the file extension. A MOV file is not guaranteed to work. |
| Animated GIF | Multi-frame conversion requires `ImageDecoder`; without it, GIF input falls back to a single frame. |
| Performance | Conversion stores generated frames in memory. Longer clips and denser grids increase processing time, memory use, and component export size. Start with a short clip and the Low or Mid quality preset. |
| Animation | Video conversion samples at 30 FPS; preview is capped at 24 FPS. These settings do not guarantee real-time conversion on every device. |
| Video export | Requires `canvas.captureStream`, `MediaRecorder`, and a supported WebM codec. Recording runs frame by frame, approximately in real time, and does not include source audio. |
| Effects | External images used by effects may require network access and suitable CORS headers for canvas export. |
| Deployment | The app includes server routes for administration. Use a Next.js server deployment; a static export does not provide those routes. |

## Repository map

```text
apps/landing/
  src/app/              Next.js pages, tool routes, and admin API routes
  src/tool/             Studio UI, conversion processor, export utilities
  src/components/       Landing page, shared UI, and showcase components
  src/data/             Showcase manifest
  src/lib/              Shared helpers and showcase storage adapters
  public/               Static assets and generated registry files
scripts/
  dev.mjs               Development launcher
  dev-options.mjs       Argument parsing and bounded port selection
  dev.test.mjs          Launcher regression tests
turbo.json              Workspace task configuration
bun.lock                Dependency lockfile
```

The active studio route is `/tool/studio`. The legacy `/studio` URL redirects to `/tool/pixel-distortion`.

## Optional showcase administration

The `/upload` dashboard manages showcase entries. For local administration, set `DASHBOARD_PASSWORD` in `apps/landing/.env.local` and restart the server. Keep that file out of version control. Without a password, dashboard login is unavailable (the login API returns HTTP 503).

Local saves use the filesystem by default and modify the app's showcase source files. The storage adapter can instead write commits to GitHub when all three credentials below are set and either `VERCEL` is present or `USE_GITHUB_STORAGE=1`:

| Variable | Purpose |
| --- | --- |
| `DASHBOARD_PASSWORD` | Server-side dashboard password |
| `GITHUB_TOKEN` | Server-side token authorized to write repository contents |
| `GITHUB_OWNER` | Target repository owner |
| `GITHUB_REPO` | Target repository name |
| `GITHUB_BRANCH` | Target branch; defaults to `main` |
| `USE_GITHUB_STORAGE` | Set to `1` to explicitly enable GitHub storage outside Vercel |

**Monorepo limitation:** showcase changes currently use app-relative paths such as `src/data/showcase-manifest.json`, while GitHub writes resolve from the repository root. For this repository's layout, the adapter needs an `apps/landing/` prefix before GitHub-backed administration is ready to use. Committed showcase changes also need a new deployment to appear in the deployed app. Treat hosted administration as a separate integration task; the public studio does not depend on it.

## Troubleshooting

- **The usual localhost URL does not load:** use the port printed by the launcher; another process may occupy port 3000.
- **No free development port:** choose a different `--base` using the command above, or stop the process occupying your intended port.
- **A video cannot be decoded:** try a short MP4 with H.264 video or another browser-decodable source.
- **Conversion is slow or the tab runs out of memory:** shorten the clip and lower the column count before converting again.
- **WebM export is unavailable:** check that the browser supports canvas recording and WebM, or use the image/React export options.

## Contributing

1. Fork the repository and create a branch for a focused change.
2. Install dependencies with the committed lockfile.
3. Run `bun run test`, `bun run lint`, and `bun run build`; report any existing failures separately from your changes.
4. For studio changes, manually check an image, a short video, and the affected exports in a desktop browser. Include reproduction steps or screenshots in your pull request.

## Sponsors

Supported by the [Vercel Open Source Program](https://vercel.com/open-source-program).

<a href="https://vercel.com/open-source-program">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge-2026.svg" />
</a>

## Star history

<a href="https://www.star-history.com/?repos=vansh-nagar%2Fascii-studio&type=date&legend=top-left">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/image?repos=vansh-nagar/ascii-studio&type=date&theme=dark&legend=top-left" />
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/image?repos=vansh-nagar/ascii-studio&type=date&legend=top-left" />
    <img alt="Star History Chart" src="https://api.star-history.com/image?repos=vansh-nagar/ascii-studio&type=date&legend=top-left" />
  </picture>
</a>
