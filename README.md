# The Signature — Nikkah Invitation

A scroll-driven, animated Nikkah invitation built with **React 19**, **Vite**, **Tailwind CSS v4**, **GSAP ScrollTrigger** and **Lenis** smooth scrolling.

## Run it

```sh
npm install
npm run dev
```

Open the printed URL (http://localhost:5173) and scroll slowly — the experience is designed for a phone-shaped viewport, so for the closest match to the original, resize the browser window to roughly 390 × 844 (or use your browser's device toolbar).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (SSR via Nitro, `node-server` preset) |
| `npm run preview` | Serve the production build (run `npm run build` first) |
| `npm run typecheck` | TypeScript check |
| `npm test` | Routing test |

## Edit the invitation

Every name, date, time, venue and host lives in one file:

```
src/lib/event.ts
```

Change the values there and the whole invitation updates.

## Structure

```
src/
  lib/event.ts              all invitation details (names, date, venue, host)
  components/invite/Frame.tsx  the brass frame, corners, florals and fountain pen
  routes/index.tsx          the seven scroll scenes + GSAP timeline
  routes/__root.tsx         HTML shell, fonts, global head
  styles.css                theme tokens (ivory / brass / olive / ink) + frame CSS
  assets/                   room photo and floral watermark
```

## The seven scenes

1. Opening hook — a fountain pen writes a signature, the camera pulls back, brass corners snap in.
2. The frame comes to life — moulding, borders and corners draw themselves as you scroll.
3. The signature interaction — tap the pen, the signature is drawn, then dissolves into the couple's names.
4. The Nikkah Nama — the document unrolls, names and requests fade in.
5. Ink-revealed details — date, time and venue, each drawn in with its own emblem.
6. The emotional moment — sunlight sweeps across the wall.
7. Grand finale — petals fall, the final card settles, the signature closes it.

## Notes

- Fonts (Cormorant Garamond, Cinzel, Pinyon Script, Noto Nastaliq Urdu) load from Google Fonts.
- `prefers-reduced-motion` is respected: the animation layer is skipped and the content is shown as a plain scroll.
- The sound button plays a soft drone generated with the Web Audio API — no audio files needed.
