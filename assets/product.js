/* Vanilla JS – no jQuery dependency */
document.addEventListener('DOMContentLoaded', function() {
  var addToCartBtn = document.getElementById('AddToCart');

  /* Auto-select the first variant when there is only one option */
  var variantItems = document.querySelectorAll('.variant_selector li');
  if (variantItems.length === 1) {
    var firstInput = variantItems[0].querySelector('input');
    if (firstInput) firstInput.click();
  }

  /* Enable Add to Cart button when any variant input changes */
  document.body.addEventListener('change', function(e) {
    if (e.target.matches('.variant_selector input')) {
      if (addToCartBtn) {
        addToCartBtn.disabled = false;
        addToCartBtn.innerHTML = '<i class="lni lni-cart"></i> Add to Cart';
      }
    }
  });

  /* Show "Added to Cart" feedback then restore original text after 2s */
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      var originalHTML = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = 'Added to Cart';

      setTimeout(function() {
        addToCartBtn.innerHTML = originalHTML;
      }, 2000);
    });
  }
});
