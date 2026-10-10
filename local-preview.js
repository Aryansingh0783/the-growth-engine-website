// Local reference-preview boundary. Never submit data to the original studio.
document.addEventListener('submit', function (event) {
  // TGE's local planner owns its validated mailto action; keep the original
  // studio forms blocked. This does not authorize a backend submission.
  if (event.target.matches?.('form.tgen-planner')) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  const form = event.target;
  if (!form.reportValidity()) return;
  let message = form.querySelector('[data-local-form-status]');
  if (!message) {
    message = document.createElement('p');
    message.dataset.localFormStatus = '';
    message.setAttribute('role', 'status');
    message.style.cssText = 'font:14px sans-serif;padding:16px;border:1px solid currentColor;margin-top:16px';
    form.appendChild(message);
  }
  message.textContent = 'Local preview: your message has not been sent. Connect your own form endpoint before publishing.';
}, true);
