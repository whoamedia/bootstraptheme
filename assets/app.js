/* INP Optimization: Configure lazySizes for better performance */
window.lazySizesConfig = {
  addClasses: true,
  lazyClass: 'lazyload',
  loadedClass: 'lazyloaded',
  loadingClass: 'lazyloading',
  preloadAfterLoad: false,
  expand: 300,
  expFactor: 1.5
};

/* INP Optimization: Defer non-critical DOM operations until after page load */
document.addEventListener('DOMContentLoaded', function() {
  /* Remove empty paragraphs - deferred to avoid blocking main thread */
  requestIdleCallback(function() {
    document.querySelectorAll('p').forEach(function(p) {
      if (p.innerHTML.replace(/\s|\u00a0/g, '').length === 0) {
        p.remove();
      }
    });
  }, { timeout: 2000 });

  /* Add img-fluid class to article images - deferred */
  requestIdleCallback(function() {
    var artEl = document.getElementById('art');
    if (artEl) {
      artEl.querySelectorAll('img').forEach(function(img) {
        img.classList.add('img-fluid');
      });
    }
  }, { timeout: 2000 });

  /* Set external links to open in new tab - deferred */
  requestIdleCallback(function() {
    var links = document.links;
    for (var i = 0, linksLength = links.length; i < linksLength; i++) {
      if (links[i].hostname !== window.location.hostname) {
        links[i].target = '_blank';
        links[i].rel = 'noopener noreferrer';
      }
    }
  }, { timeout: 3000 });
});

/* INP Optimization: Use passive event listeners and event delegation */
(function() {
  document.body.addEventListener('click', function(e) {
    var target = e.target.closest('[data-bs-toggle="lightbox"], [data-toggle="lightbox"]');
    if (target && window.openBootstrapLightbox) {
      e.stopPropagation();
      e.preventDefault();
      window.openBootstrapLightbox(target);
    }
  }, { passive: false });

  /* Currency form change handler with passive listener */
  document.body.addEventListener('change', function(e) {
    if (e.target.matches('.shopify-currency-form select')) {
      e.target.closest('form').submit();
    }
  }, { passive: true });
})();

/* Polyfill for requestIdleCallback */
window.requestIdleCallback = window.requestIdleCallback || function(cb, options) {
  var start = Date.now();
  return setTimeout(function() {
    cb({
      didTimeout: false,
      timeRemaining: function() {
        return Math.max(0, 50 - (Date.now() - start));
      }
    });
  }, 1);
};
