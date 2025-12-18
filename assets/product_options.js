if($(window).width() < 768){
  is_window = "mobile";
}
else {
  is_window = "window";
}


$(window).resize(function(){
  if($(this).width() < 768){
    is_window = "mobile";
  }
  else {
  	is_window = "window";
  }
})



var cart_product_id;

var idxArrById = new Array();

var product_values = new Array();

var size_arr = new Array(), color_arr = new Array();
var size_content_str = '', color_content_str = '';

var last_selector = '';

if(product_variants.length > 1){
  
  for(var idx = 0; idx < product_variants.length; idx ++){

    var variant = product_variants[idx];
   

    product_values[(variant.options).toString()] = variant.id;
	idxArrById[variant.id] = idx;

    var size = variant.option1;
    var color = variant.option2;
    var _class = '';

    if(size != null){
      if(size_arr.indexOf(size) < 0) {
        if(color == null && variant.available != true){
        	_class = "empty";
        }
        size_content_str += '<label class="'+_class+'" name="'+size+'">'+size+'</label>';
        size_arr.push(size);
      }
    }

    if(color != null){
      if(color_arr.indexOf(color) < 0) {
        if(size == null && variant.available != true){
        	_class = "empty";
        }
        color_content_str += '<label class="'+_class+'" name="'+color+'"><img src="'+variant.featured_image.src+'"></label>';
        color_arr.push(color);
      }
    }
  }
  disableCartBtn();
}
else {
  
  $('form[action="/cart/add"] input[type="hidden"]').attr('value', product_variants[0].id).attr('data-id', product_variants[0].id);
 
}



$(".product-size").html(size_content_str);
$(".product-color").html(color_content_str);


var active_color;
var active_size;


$(".product-color label:not('.empty')").on('click', function(){
  
  var handle = $(this).attr('class');
  
  if(handle != '.empty'){

    active_color = $(this).attr("name");

    $(".product-color label").removeAttr("selected");

    $(this).attr('selected', 'selected');

    $(".product-color label").removeClass("disabled");

    $(".product-size label").removeAttr('selected').addClass("disabled");


    $(".product-thumbs a[data-color='"+active_color+" ']").click();

    for(var i = 0; i < product_variants.length; i ++){

      var variant = product_variants[i];

      if(active_color == variant.option2 && variant.available == true){

        $(".product-size label").each(function(){

          if($(this).attr("name") == variant.option1){

            $(this).removeClass("disabled").removeAttr("selected");

            if($(this).attr("name") == active_size){

              $(this).attr("selected", "selected");
            }
          }
        })
      }
    }

    if(product_variants.length > 1){
      var value_key = active_size;
      if(color_arr.length > 0){
        value_key += ",";
        value_key += active_color;
      }
      cart_product_id = product_values[value_key]
    }

    $('form[action="/cart/add"] input[type="hidden"]').attr('value', cart_product_id).attr('data-id', cart_product_id);
    _is_selected();

    last_selector = "color";
  }
});



$(".product-size label:not('.empty')").on('click', function(){
  var handle = $(this).attr('class');
  if(handle != "empty"){
    active_size = $(this).attr("name");

    $(".product-size label").removeAttr("selected");

    $(this).attr('selected', 'selected');

    $(".product-size label").removeClass("disabled");

    $(".product-color label").removeAttr("selected").addClass("disabled");

    for(var i = 0; i < product_variants.length; i ++){

      var variant = product_variants[i];

      if(active_size == variant.option1 && variant.available == true){

        $(".product-color label").each(function(){

          if($(this).attr("name") == variant.option2){

            $(this).removeClass("disabled").removeAttr("selected");

            if($(this).attr("name") == active_color){

              $(this).attr("selected", "selected");

            }
          }
        })
      }
    }
  
    if(product_variants.length > 1){
      var value_key = active_size;
      if(color_arr.length > 0){
        value_key += "," + active_color;
      }
      cart_product_id = product_values[value_key]
    }
    
    $('form[action="/cart/add"] input[type="hidden"]').attr('value', cart_product_id).attr('data-id', cart_product_id);
    _is_selected();

    last_selector = "size";
  }

});


var zoom_img_url;
$(".product-thumbs a").on('click', function(){
  
  var selected_img_url = $(this).find('img').attr('src');
  var show_img_url = selected_img_url.replace("55x", "400x");
  zoom_img_url = selected_img_url.replace("_55x", "");
  
  $(".easyzoom > a img").attr('src', show_img_url);
  
  $(".easyzoom > a").attr('href', zoom_img_url);
  
  $('.easyzoom-flyout > img').attr('src', zoom_img_url);
  
  return false;

})


$(".easyzoom--overlay").on('mousemove', function(){
  $('.easyzoom-flyout > img').attr('src', zoom_img_url);
})


var has_color, has_size;

function _is_selected(){

  var is_color_selected;
  
  var is_size_selected;
  
  is_size_selected = $(".product-size label[selected='selected']").length;
  
  is_color_selected = $(".product-color label[selected='selected']").length;
  
  has_color = color_arr.length;
  has_size = size_arr.length;
  
  if(has_color > 0 && has_size > 0){
    if(is_size_selected == 1 && is_color_selected == 1){
      enableCartBtn();
    }
    else {
  	  disableCartBtn();
    }
  }
  else {
    if(((has_color == 0 && is_size_selected == 1) || (has_size == 0 && is_color_selected == 1)) && (product_variants[idxArrById[cart_product_id]].available == true)){
      enableCartBtn();

    }
    else {
      disableCartBtn();
    }
  }
  
}


function enableCartBtn(){
    $('#AddToCart').removeAttr("disabled");
    $('#AddToCart').html('Add to Cart');
    $("form span.product_num number").html(product_inventory[cart_product_id]);
    $("form span.product_num").css('visibility', 'visible');
}

function disableCartBtn(){
    $('#AddToCart').attr("disabled", "disabled");
    $('#AddToCart').html('SELECT SIZE');
    $("form span.product_num").css('visibility', 'hidden');
}






var warning_obj;
 
$(document).ready(function(){

  var product_vid;
    $("#cart_popup").on('mousedown', '.item_column', function(){
  	product_vid = $(this).find('a#product_name').attr('href');
  })
  
  $("#cart_popup").on('click', 'a.plus_qty', function(){
	var cur_qty = $(this).parent().find('span').text();
    product_vid = (product_vid.split("variant="))[1];
  	check_inventory_qty(cur_qty, product_vid);
	warning_obj = $(this).parents('.item_quantity').next().next();
  })
  
  $("#AddToCart").on('click', function(){
    var product_qty = product_inventory[cart_product_id];
    product_qty = parseFloat(product_qty) - 1;
    product_inventory[cart_product_id] = product_qty;
    $("form span.product_num number").html(product_qty);
    if(product_qty == 0){
	  product_variants[idxArrById[cart_product_id]].available = false;
      if(last_selector == "color"){
        if(has_size == 0){
			$(".product-color label[name='"+active_color+"']").removeAttr('selected').attr('class', 'empty');
        }
        else {
        	$(".product-color label[name='"+active_color+"']").removeAttr('selected').addClass('disabled');
        }
        
      	active_color = '';
        $("form[action='/cart/add']").submit();
        disableCartBtn();
      }
      else {
        if(has_color == 0){
        	$(".product-size label[name='"+active_size+"']").removeAttr('selected').attr('class', 'empty');
        }
        else {
        	$(".product-size label[name='"+active_size+"']").removeAttr('selected').addClass('disabled');
        }
      	active_size = '';
		$("form[action='/cart/add']").submit();
        disableCartBtn();
      }
    } 
    
  })
})

function check_inventory_qty(cur_qty, vid){
  $.ajax({
    type: 'GET', 
    url: '/admin/api/2019-04/variants/'+vid+'.json',
    dataType: 'json',
    success: function(res){
      if(res['variant']['inventory_quantity'] == cur_qty){
        warning_obj.css('visibility', 'visible');
		setTimeout(function(){$(".item_column .warning").css('visibility', 'hidden');}, 2000);
      }
    },
    error: function(err){
      $(that).parent().removeAttr('disabled');
      console.log(err);
    }
 });
  
}