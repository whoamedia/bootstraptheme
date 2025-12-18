$(document).ready(function () {
                    
                        
         if (cart.item_count <= 0) {
                                console.log('Showing Empty Cart Icon');
                                $("#cart-empty").removeClass("d-none");
                                $("#cart_footer").addClass("d-none");
                            } else {
                                $("#cart-empty").addClass("d-none");
                                $("#cart_footer").removeClass("d-none");
                            }
                            
                           
                            $('input').change(function() {
                            $('#AddToCart').removeAttr("disabled");
                            $('#AddToCart').html('<span class="icon-cart"></span> Add to Cart');
                            const element =  document.querySelector('#AddToCart')
                            element.classList.add('animated', 'swing');
                             const element2 =  document.querySelector('.icon-cart')
                            element2.classList.add('animated','infinite', 'fadeIn')
                        
                       
                            });
 
                        $('#AddToCart').on('click', function () {
                            var itemEl = $(this);
                            itemEl.data('originalText', $(this).html());
                            itemEl.html('Added to Cart');
                                   const element3 =  document.querySelector('#carticon')
                            element3.classList.add('animated', 'rubberBand');
                            $('#cartpopup').modal('show');
                            setTimeout(function () {
                                itemEl.html(itemEl.data('originalText'))
                            }, 2000);
                        });
                        
                         //  $('#carticon').on('click', function () {
                       //  window.showCart();
                       // });
                        
                        $('#AddToCart').html('<span class="icon-cart"></span> Add to Cart ');
                        $(document).on('cart.requestComplete', function (event, cart) {
                            $('#counter').html(cart.item_count);
                            //$('#ship').load(' #ship');
                           
                            $(".success").removeClass("d-none")
                            if (cart.item_count <= 0) {
                                console.log('Showing Empty Cart Icon');
                                $("#cart-empty").removeClass("d-none");
                                $("#cart_footer").addClass("d-none");
                            } else {
                                $("#cart-empty").addClass("d-none");
                                $("#cart_footer").removeClass("d-none");
                            }
                        });
                        