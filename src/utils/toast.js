const TOAST_EVENT = "hislink:toast";

export function showToast(message, { variant = "info", durationMs = 4000 } = {}) {
  if (!message) return;
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { message, variant, durationMs, id: Date.now() }
    })
  );
}

export { TOAST_EVENT };
