/**
 * Heavy wheel scrolling — one engine for every kind of travel on this page.
 *
 * Native wheel input is intercepted and the page chases a target with a slow
 * lerp instead of jumping per notch. That lag is the weight: flicks glide and
 * settle instead of snapping, and because everything on this site reads
 * scrollYProgress (the hero tip, the WebGL camera dolly), every scrubbed
 * effect inherits the same drag for free.
 *
 * `window.scrollY` stays the source of truth — we never translate a wrapper —
 * so framer-motion's useScroll, the native scrollbar, keyboard paging and
 * touch momentum all keep working untouched. Only wheel is intercepted, and
 * never under prefers-reduced-motion, where every jump is instant.
 *
 * No setState lives in any of these handlers; the loop writes the scroll
 * position and nothing else.
 */

/** Per-frame follow at 60fps. Lower = heavier. ~200ms to cover a flick. */
const LERP = 0.08;
/** Max queued travel as a fraction of viewport height — keeps a violent
 *  trackpad flick tethered to the page instead of running away. */
const MAX_LEAD = 1.5;
/** Gap (px) at which we count the target as reached. */
const SNAP = 0.5;
/** Tolerance (px) for scroll positions we wrote ourselves, so our own writes
 *  are never mistaken for external travel (browsers round scrollY). */
const SELF_TOLERANCE = SNAP + 1;

let current = 0;
let target = 0;
let frame = null;
/** Last scroll position this module wrote, used to tell our writes apart
 *  from scrollbar drags, keyboard paging, touch and browser jumps. */
let lastWritten = null;
let wheelInstalled = false;

const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const maxScroll = () =>
  Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

const clamp = (y) => Math.min(Math.max(y, 0), maxScroll());

function stop() {
  if (frame !== null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
}

function tick() {
  current += (target - current) * LERP;
  if (Math.abs(target - current) < SNAP) current = target;
  lastWritten = current;
  // 'instant' bypasses any CSS scroll-behavior — the engine is the only
  // thing allowed to decide how fast the page moves.
  window.scrollTo({ top: current, left: 0, behavior: 'instant' });
  frame = current === target ? null : requestAnimationFrame(tick);
}

function start() {
  if (frame === null && current !== target) frame = requestAnimationFrame(tick);
}

function onWheel(e) {
  // Ctrl+wheel is pinch-zoom / browser zoom — leave it to the OS.
  if (e.ctrlKey) return;
  let dy = e.deltaY;
  if (e.deltaMode === 1) dy *= 16; // lines (Firefox)
  else if (e.deltaMode === 2) dy *= window.innerHeight; // pages
  if (dy === 0) return;
  e.preventDefault();
  const lead = window.innerHeight * MAX_LEAD;
  target = clamp(
    Math.min(Math.max(target + dy, current - lead), current + lead),
  );
  start();
}

function onScroll() {
  const y = window.scrollY;
  if (lastWritten !== null && Math.abs(y - lastWritten) <= SELF_TOLERANCE) {
    return; // one of our own writes coming back around
  }
  // External travel (scrollbar drag, keyboard, touch, a browser jump):
  // adopt it as the new truth and stop chasing the old target.
  current = target = clamp(y);
  lastWritten = y;
  stop();
}

/**
 * Scroll to an absolute Y position with the engine's weight. Under
 * prefers-reduced-motion this is an instant jump with no animation at all.
 */
export function scrollToY(top) {
  const y = clamp(top);
  if (prefersReduced()) {
    current = target = y;
    lastWritten = y;
    window.scrollTo({ top: y, left: 0, behavior: 'instant' });
    stop();
    return;
  }
  target = y;
  start();
}

/** Glide to a section by id — the path every in-page button takes. */
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  scrollToY(el.getBoundingClientRect().top + window.scrollY);
}

/**
 * Install the wheel listener and the scroll-adopting listener. Returns its
 * own cleanup, so App can treat it exactly like trackPointer().
 */
export function initSmoothScroll() {
  current = target = window.scrollY;
  lastWritten = window.scrollY;

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sync = () => {
    const want = !media.matches;
    if (want === wheelInstalled) return;
    wheelInstalled = want;
    if (want) {
      window.addEventListener('wheel', onWheel, { passive: false });
    } else {
      window.removeEventListener('wheel', onWheel);
      current = target = window.scrollY;
      stop();
    }
  };
  sync();
  // The OS setting can flip mid-session; the wheel is only ever intercepted
  // while motion is welcome.
  media.addEventListener('change', sync);
  window.addEventListener('scroll', onScroll, { passive: true });

  return () => {
    if (wheelInstalled) window.removeEventListener('wheel', onWheel);
    wheelInstalled = false;
    media.removeEventListener('change', sync);
    window.removeEventListener('scroll', onScroll);
    stop();
  };
}
