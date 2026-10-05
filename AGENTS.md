# Agent guidelines — Mandeep.dev portfolio

Personal portfolio. **React 19 + Vite 7 + Tailwind CSS 4 + framer-motion**, plain
JavaScript (JSX), no TypeScript. It presents a **warm, light, editorial** design.
The fixed page backdrop is **real WebGL via three.js** (`src/lib/threeScene.js` +
`src/components/webgl/`); everything in the scrolling content is still CSS-3D +
framer-motion. There is **no React Three Fiber, no drei, and no GSAP** — don't
add any.

## Skills — load the relevant one before you start

Detailed guidance lives in `.opencode/skills/`. Read the `SKILL.md` for your task
rather than working from memory; each is short and points at deeper `references/`
when you need them.

| Skill                | Load it when                                                                 |
| -------------------- | ---------------------------------------------------------------------------- |
| `project-facts`      | Adding files, wiring imports, running scripts, or anything touching paths/deploy |
| `frontend-design`    | Adding or restyling any section, card, button, heading, or layout             |
| `motion-3d`          | Any animation, 3D depth, tilt, parallax, scroll-linking, or entrance reveal   |
| `react-conventions`  | Writing or reviewing any `.jsx`/`.js`, matching house style                   |
| `verification`       | Before declaring a change done, or debugging a rendering/layout problem       |

## The two 3D systems, and which is which

| Path                 | Technique                                                        |
| -------------------- | ---------------------------------------------------------------- |
| `components/webgl/`  | **three.js.** The fixed full-viewport backdrop behind everything. |
| `components/three/`  | **CSS 3D only** — framer-motion transforms. Despite the folder name, nothing in it uses WebGL. |

`components/three/DepthStage.jsx` is now the **fallback** for `WebGLBackdrop`. Keep
it working: it is what a visitor without WebGL, or with the context lost mid-session,
sees, and it must stay visually interchangeable.

Rules for the WebGL layer that the CSS layer does not need:

- **Never mount a canvas inside a section.** One fixed canvas for the page.
- **Keep `pointer-events: none`** on `.webgl-stage`. It covers the whole viewport and
  will otherwise swallow every click on the site.
- **No CSS `perspective`** on the stage — the camera owns the projection.
- **The renderer is transparent on purpose.** Never set a clear colour or an opaque
  background; the warm paper and the noise grain live in CSS. The scene may only ever
  add low-alpha tints and lines, or it will fight the body text.
- **Cap DPR at 2**, stop the loop on `visibilitychange`, and dispose geometries,
  materials, textures and the context on unmount.
- **Read input inside the frame callback** off the shared MotionValues. Never
  `setState` per frame, and never bind a MotionValue to a `style` prop here.

## Commands

```bash
pnpm install
pnpm dev          # http://localhost:5173/Mandeep.dev/  (note the base path)
pnpm build        # the real correctness gate
pnpm lint
pnpm deploy       # GitHub Pages
```

No test framework. If tests are ever added, use Vitest.

## Three things that will break the build or the design

1. **There is no `@/` import alias.** `vite.config.js` sets only
   `base: '/Mandeep.dev/'`. Every import is **relative**
   (`../ui/Button`, `../../lib/motion`). `import x from '@/components/...'` fails
   to resolve. This is the single most common mistake here.
2. **The base path is `/Mandeep.dev/`.** `BrowserRouter` uses
   `basename={import.meta.env.BASE_URL}`, and asset URLs need the prefix — but
   prefer importing assets from `src/assets/` so Vite rewrites them. One hardcoded
   path is still broken: `project.video` in `src/data/portfolio.js`.
3. **Preserve the design.** Warm light surfaces, terracotta/slate/amber accents,
   Outfit + Clash Display + JetBrains Mono. Bug fixes must not change type size,
   colour, spacing, or copy. No dark surfaces, no new dependencies — `three` is the
   one exception, and it is code-split into its own lazy chunk.

## Known pre-existing issues (not yours unless you touch them)

- `console.log("Message sent successfully!")` in `Contact.jsx`.
- A framer-motion dev warning — *"container has a non-static position"* — from
  `useScroll({ target })` in `Hero.jsx`, because `html` is `position: static`.
  Dev-only. Do **not** "fix" it by adding `position: relative` to `html` without
  checking the hero scrub first: that changes `offsetParent`, which is what
  framer measures the hero's scroll offsets through.

## Non-negotiables

- **Semicolons** and **single quotes**. (The old version of this file said the
  opposite and contradicted its own examples.)
- Animate only `transform` and `opacity` — never `width`, `height`, `top`, `left`.
- **Every animation needs a `prefers-reduced-motion` branch.** Content must never
  depend on an animation to exist, and nothing may exist only at an animation's
  end state. This includes infinite loops.
- **Never `setState` in a pointer/scroll handler** — use a MotionValue or a ref.
  `lib/pointer.js` already provides shared pointer values; don't add listeners.
- framer-motion **overwrites** any CSS `transform`, so never put Tailwind
  `translate-*` and a framer transform on the same node.
- Section `id`s are functional (buttons scroll to them). Don't rename casually.
- Real content in real DOM. Accessible: semantic landmarks, one `h1`, alt text,
  visible focus rings, keyboard parity with hover.

## Before you call it done

`pnpm lint && pnpm build`, then check in a browser at 1440×900 and 390×844,
including a reduced-motion pass and one mid-scroll position. Confirm the console
is clean, nothing 404s, there's no horizontal overflow, and no text is left
invisible. See the `verification` skill.
