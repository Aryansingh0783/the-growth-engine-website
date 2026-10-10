// Apply before the captured runtime or HTML can restore a previous scroll offset.
(() => {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const reloading = performance.getEntriesByType('navigation')[0]?.type === 'reload';
  if (!reloading) return;
  if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
  const reset = () => {
    if (window.TGEScroll) window.TGEScroll.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  reset();
  document.addEventListener('DOMContentLoaded', reset, { once: true });
  addEventListener('pageshow', reset, { once: true });
  // Readiness resolves against the mounted Framer tree, before the loader exits.
  document.addEventListener('DOMContentLoaded', () => {
    window.TGEEntryReady?.then(reset);
  }, { once: true });
})();
