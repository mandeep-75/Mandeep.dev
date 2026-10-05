/**
 * Can this browser actually give us a WebGL context?
 *
 * Checked before the scene is ever constructed. `getContext` returning null is
 * the normal failure — an old driver, a blocklisted GPU, a headless runner, or
 * a user who has switched hardware acceleration off — and in every one of those
 * cases the right answer is to render the CSS backdrop instead of mounting a
 * canvas that will render nothing.
 *
 * The probe canvas is deliberately never attached to the document and never
 * explicitly context-lost. Calling `WEBGL_lose_context` on it has a habit of
 * leaving the browser in a state where the *next* real context creation is
 * refused, which turns a working machine into a permanent fallback. Letting a
 * detached, unreferenced canvas fall out of scope is enough.
 *
 * @returns {boolean}
 */
export function isWebGLAvailable() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }

  try {
    const canvas = document.createElement('canvas');
    // webgl2 first; the context attributes are left at their defaults because
    // we only care whether a context exists, not what it can do.
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return Boolean(gl);
  } catch {
    // Some browsers throw rather than returning null when WebGL is disabled by
    // policy. A throw here is still just "unavailable".
    return false;
  }
}
