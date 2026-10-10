(() => {
  'use strict';
  if (window.__tgeTestimonials) return;
  window.__tgeTestimonials = true;
  let activeDialog = null, returnFocus = null, stoppedScroll = false;
  let grid = null, gridVisible = false;
  const gridVideos = new Set();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const gridShouldPlay = () => gridVisible && !activeDialog && !reducedMotion.matches && !document.hidden;
  const updateGrid = () => {
    const shouldPlay = gridShouldPlay();
    for (const video of gridVideos) {
      if (!video.isConnected) { gridVideos.delete(video); continue; }
      if (shouldPlay) { if (video.paused) video.play().catch(() => {}); }
      else if (!video.paused) video.pause();
    }
  };
  const gridObserver = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.target === grid) gridVisible = entry.isIntersecting;
    updateGrid();
  },{rootMargin:'250px 0px'});
  const mountGrid = () => {
    const nextGrid = document.querySelector('[data-tge-testimonials]');
    if (nextGrid !== grid) {
      gridObserver.disconnect(); grid = nextGrid; gridVisible = false; gridVideos.clear();
      if (grid) gridObserver.observe(grid);
    }
    for (const video of grid?.querySelectorAll('video') || []) {
      if (gridVideos.has(video)) continue;
      gridVideos.add(video);
      // The native Video component may request playback after mounting. Gate
      // those requests too, so hidden demo tiles do not keep decoding.
      video.addEventListener('play',() => { if (!gridShouldPlay()) video.pause(); });
    }
    updateGrid();
  };
  reducedMotion.addEventListener('change',updateGrid);
  document.addEventListener('visibilitychange',updateGrid);
  const focusables = dialog => [...dialog.querySelectorAll('button,video[controls],[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')].filter(node => !node.disabled && node.getClientRects().length);
  document.addEventListener('focusin', event => {
    if (event.target.closest?.('[data-tge-testimonial-play]')) returnFocus = event.target.closest('[data-tge-testimonial-play]');
  });
  document.addEventListener('pointerdown', event => {
    if (event.target.closest?.('[data-tge-testimonial-play]')) returnFocus = event.target.closest('[data-tge-testimonial-play]');
  }, true);
  document.addEventListener('keydown', event => {
    if (!activeDialog?.isConnected || event.key !== 'Tab') return;
    const nodes = focusables(activeDialog), first = nodes[0], last = nodes[nodes.length - 1];
    if (!first) { event.preventDefault(); activeDialog.focus({preventScroll:true}); return; }
    if (event.shiftKey && (document.activeElement === first || !activeDialog.contains(document.activeElement))) { event.preventDefault(); last.focus({preventScroll:true}); }
    else if (!event.shiftKey && (document.activeElement === last || !activeDialog.contains(document.activeElement))) { event.preventDefault(); first.focus({preventScroll:true}); }
  });
  const mount = () => {
    mountGrid();
    const dialog = document.querySelector('[data-tge-testimonial-dialog]');
    if (dialog === activeDialog) return;
    if (dialog) {
      activeDialog = dialog;
      updateGrid();
      returnFocus ||= document.querySelector('[data-tge-testimonial-play]');
      // The native overlay locks browser scrolling. Suspend the same Lenis
      // controller as well, and only resume it when this dialog stopped it.
      // Native video controls still receive their ordinary pointer/touch events.
      if (window.TGEScroll?.stop && !window.TGEScroll.isStopped) { window.TGEScroll.stop(); stoppedScroll = true; }
      requestAnimationFrame(() => { if (activeDialog === dialog && dialog.isConnected) dialog.querySelector('.tge-testimonial-close')?.focus({preventScroll:true}); });
    } else if (activeDialog) {
      activeDialog = null;
      updateGrid();
      if (stoppedScroll) window.TGEScroll?.start?.();
      stoppedScroll = false;
      if (returnFocus?.isConnected) returnFocus.focus({preventScroll:true});
    }
  };
  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement,{childList:true,subtree:true});
  mount();
  addEventListener('pagehide',() => { observer.disconnect(); gridObserver.disconnect(); gridVisible=false; updateGrid(); if (stoppedScroll) window.TGEScroll?.start?.(); stoppedScroll=false; });
  addEventListener('pageshow',() => { observer.observe(document.documentElement,{childList:true,subtree:true}); if (grid) gridObserver.observe(grid); mount(); });
})();
