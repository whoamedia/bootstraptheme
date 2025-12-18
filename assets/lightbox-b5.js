(() => {
  const ensureModal = () => {
    let modal = document.getElementById('bs-lightbox');
    if (modal) return modal;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
<div class="modal fade" id="bs-lightbox" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content bg-dark">
      <div class="modal-body p-0">
        <div id="bs-lightbox-image-wrap" class="ratio ratio-16x9 d-none">
          <iframe id="bs-lightbox-iframe" class="w-100 h-100 border-0" allowfullscreen></iframe>
        </div>
        <img id="bs-lightbox-image" class="img-fluid w-100 d-none" alt="">
      </div>
      <div class="modal-footer border-0 justify-content-end">
        <button type="button" class="btn btn-light" data-bs-dismiss="modal" aria-label="Close lightbox">Close</button>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(wrapper.firstElementChild);
    return document.getElementById('bs-lightbox');
  };

  const isVideo = (url) => {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const toEmbedUrl = (url) => {
    if (url.includes('youtu.be')) {
      const id = url.split('/').pop().split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtube.com/watch')) {
      const params = new URL(url).searchParams;
      const id = params.get('v');
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    if (url.includes('vimeo.com')) {
      const id = url.split('/').pop().split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    return url;
  };

  window.openBootstrapLightbox = (triggerEl) => {
    const modalEl = ensureModal();
    const imgEl = modalEl.querySelector('#bs-lightbox-image');
    const iframeWrap = modalEl.querySelector('#bs-lightbox-image-wrap');
    const iframeEl = modalEl.querySelector('#bs-lightbox-iframe');
    const src = triggerEl.getAttribute('data-remote') || triggerEl.getAttribute('href');
    if (!src) return;
    const title = triggerEl.getAttribute('title') || triggerEl.getAttribute('aria-label') || '';

    // reset
    imgEl.classList.add('d-none');
    iframeWrap.classList.add('d-none');
    iframeEl.setAttribute('src', '');

    if (isVideo(src)) {
      iframeEl.setAttribute('src', toEmbedUrl(src));
      iframeEl.setAttribute('title', title);
      iframeWrap.classList.remove('d-none');
    } else {
      imgEl.setAttribute('src', src);
      imgEl.setAttribute('alt', title);
      imgEl.classList.remove('d-none');
    }
    if (window.bootstrap && window.bootstrap.Modal) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
      modal.show();
    }
  };

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('[data-bs-toggle="lightbox"], [data-toggle="lightbox"]');
    if (!anchor) return;
    e.preventDefault();
    window.openBootstrapLightbox(anchor);
  });
})();

