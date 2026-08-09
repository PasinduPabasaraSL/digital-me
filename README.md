# digital-me

An interactive portfolio for **Pasindu Pabasara**, built as a working replica of the Ubuntu 24.04 desktop. Boot the machine, unlock it, open a terminal, and run `neofetch`.

Live sections aren't pages — they're applications. Projects live in Files, work history is presented by a mock `systemctl`, skills are graphed in System Monitor, and the contact form is a mail client.

## Stack

| | |
|---|---|
| Build | Vite 8 |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 (CSS-first `@theme`) |
| State | Zustand |
| Fonts | Ubuntu / Ubuntu Mono, self-hosted woff2 |
| Images | WebP derivatives generated with ImageMagick |

No UI kit, no animation library, no icon package — the window manager, the icons and the shell chrome are all hand-built, which is what keeps the first load at roughly 80 KB gzipped.

## Getting started

```bash
npm install
npm run dev
```

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server on :5173 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run images` | Regenerate WebP derivatives from source JPEGs |
| `npm run fonts` | Re-download the Ubuntu woff2 subset |

`npm run images` and `npm run fonts` only need running when you add a source image or change font weights; their output is committed.

## Architecture

The app is a window manager rendering over a content layer, so adding an app never means touching the shell.

```
src/
  data/                  All portfolio content, typed. Single source of truth.
  store/
    windows.ts           Window geometry, z-order, focus, snapping
    system.ts            Boot phase, accent colour, wallpaper, persistence
  components/
    boot/                Boot animation and lock screen
    shell/               Top bar, dock, desktop icons, wallpaper, Activities
    wm/                  Window chrome (drag, resize, maximise, snap)
    mobile/              Ubuntu Touch style launcher for small screens
    icons/               Yaru-flavoured app icons as inline SVG
  apps/
    registry.tsx         One entry per app; every component lazy-loaded
    Terminal/ Files/ Gallery/ ...
```

Adding an app is a single entry in `src/apps/registry.tsx` plus a component. Content changes never require touching a component — edit the relevant file in `src/data/`.

## Performance

- **Code splitting.** The shell ships alone; each app is a separate chunk fetched the first time its window opens. The heaviest app (Terminal) is 14 KB.
- **Static SEO.** A Vite plugin renders the portfolio content and a `schema.org/Person` JSON-LD block into `index.html` at build time, outside `#root`, so crawlers and screen readers get real semantic HTML from a desktop that is otherwise built at runtime.
- **Images.** 4.5 MB of source JPEGs compile to 1.8 MB of WebP; the gallery grid loads only ~400 KB of thumbnails, and full-size images load on click.
- **Fonts.** Latin-subset woff2 served from the same origin with `font-display: swap`, so there is no render-blocking request to Google.
- **Direct DOM writes while dragging.** Window moves and resizes bypass React and commit to the store on pointer release, so dragging one window doesn't re-render the others.

## Terminal

The terminal is the centrepiece. `help` lists everything; the commands worth trying:

```
neofetch            system summary with the Ubuntu logo
docker ps           projects as running containers
kubectl get pods    projects as pods across namespaces
systemctl status    work experience as systemd services
htop                skills as resource usage
cat seekersconnect  details for a single project
open gallery        launch another app from the shell
```

Arrow keys walk history, `Tab` completes, `Ctrl+L` clears.

## Deploying

The build is fully static — any host works.

```bash
npm run build   # outputs dist/
```

Set the deploy directory to `dist/`. Update the canonical URL in `index.html` when the domain is final.

## Notes

- The previous single-page site is preserved under `legacy/`.
- The contact form posts to FormSubmit's AJAX endpoint. The **first** message to a new address triggers a one-time confirmation email from FormSubmit that must be accepted before messages are delivered.
- Wallpapers are CSS gradients rather than Canonical's shipped artwork, which is both faster and avoids redistributing assets that aren't ours.
