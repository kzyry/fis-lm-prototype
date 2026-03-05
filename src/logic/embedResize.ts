export function initEmbedResize() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('embed') !== '1') return;

  let lastHeight = 0;

  const sendHeight = () => {
    const height = document.body.scrollHeight;
    if (height !== lastHeight) {
      lastHeight = height;
      window.parent.postMessage({ type: 'prototype-resize', height }, '*');
    }
  };

  const observer = new ResizeObserver(() => sendHeight());
  observer.observe(document.body);

  // Initial send after a short delay to let layout settle
  setTimeout(sendHeight, 100);
}
