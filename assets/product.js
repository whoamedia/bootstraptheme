$(document).ready(function() {
  if($('#variant_selector li').length == 1) {
    $('#variant_selector li:first input').click();
  }
});

$('input').change(function() {
  $('#AddToCart').removeAttr("disabled");
  $('#AddToCart').html('<i class="lni lni-cart"></i> Add to Cart');
});

$('#AddToCart').on('click', function() {
  var itemEl = $(this);
  itemEl.data('originalText', $(this).html());
  itemEl.html('Added to Cart');

  setTimeout(function() {
    itemEl.html(itemEl.data('originalText'));
  }, 2000);
});
