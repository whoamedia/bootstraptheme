window.lazySizesConfig = {
  addClasses: true
};

jQuery("p").each(function() {
  var a = jQuery(this);
  if (a.html().replace(/\s|\u00a0/g, "").length === 0) {
    a.remove();
  }
});

$("#art").contents().find("img").addClass("img-fluid");

var links = document.links;
for (var i = 0, linksLength = links.length; i < linksLength; i++) {
  if (links[i].hostname !== window.location.hostname) {
    links[i].target = '_blank';
  }
}

(function($) {
  $("body").on("click", '[data-bs-toggle="lightbox"], [data-toggle="lightbox"]', function(b) {
    if (window.openBootstrapLightbox) {
      b.stopPropagation();
      b.preventDefault();
      window.openBootstrapLightbox(this);
    }
  });
})(window.$);

$('.shopify-currency-form select').on('change', function() {
  $(this).parents('form').submit();
});
