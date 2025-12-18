// $(document).on('cart.ready', function (event, cart) {
//     if (cart.item_count <= 0) {
//         $("#cart-empty").removeClass("d-none");
//         $("#cart_footer").addClass("d-none");
//     } else {
//         $("#cart-empty").addClass("d-none");
//         $("#cart_footer").removeClass("d-none");
//     }
// });

// $(document).on('cart.requestComplete', function (event, cart) {
//     $('#counter').html(cart.item_count);
//     $('#cartpopup').modal('show');
// });
// $('#carticon').click(function () {
//     $('#cartpopup').modal('show');
// });

$(document).ready(function () {

   


});
document.addEventListener(
    "DOMContentLoaded", () => {
        const node = document.querySelector("#my-menu");
        const menu = new MmenuLight(node);

        menu.enable("(max-width: 600px)");
        menu.offcanvas();
        document.querySelector('a[href="#my-menu"]')
            .addEventListener('click', (evnt) => {
                menu.open();
                evnt.preventDefault();
                evnt.stopPropagation();
            });
    }
);

window.lazySizesConfig = {
    addClasses: true
};
//   $(document)
//                     .ready(function () {
//                         document.querySelectorAll('a[href="/cart"]')
//                           .forEach(function (e, k) {
//                               e.addEventListener("click", function (event) {
//                                       event.preventDefault();
//                                      $('#cartpopup').modal('show');
//                                   });
//                  });
//   });

$('input').change(function () {
    $('#AddToCart').removeAttr("disabled");
    $('#AddToCart').html('<i class="lni lni-cart"></i> Add to Cart');
});

$('#AddToCart').on('click', function () {
    var itemEl = $(this);
    itemEl.data('originalText', $(this).html());
    itemEl.html('Added to Cart');

    setTimeout(function () {
        itemEl.html(itemEl.data('originalText'))
    }, 2000);
});


// $('#AddToCart').html('<span class="icon-cart"></span> Add to Cart ');
// $(document).on('cart.requestComplete', function (event, cart) {
//     $('#counter').html(cart.item_count);
//     $(".success").removeClass("d-none")
//     if (cart.item_count <= 0) {
//         console.log('Showing Empty Cart Icon');
//         $("#cart-empty").removeClass("d-none");
//         $("#cart_footer").addClass("d-none");
//     } else {
//         $("#cart-empty").addClass("d-none");
//         $("#cart_footer").removeClass("d-none");
//     }
// });

jQuery("p").each(function () {
    var a = jQuery(this);
    0 === a
        .html()
        .replace(/\s|\u00a0/g, "")
        .length && a.remove()
});
//     var b = $("iframe").attr("src");
//     $("iframe").attr("src", b + "?rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0");
//     jQuery("[max]").change(function () {
//         var a = parseInt(jQuery(this).attr("max"), 10) || 1E4;
//         (parseInt(jQuery(this).val(), 10) || 0) > a && (alert("We only have " + a + " of this item in stock"), jQuery(this).val(a))
//     })

$("#art")
    .contents()
    .find("img")
    .addClass("img-fluid");


/* ---- Code to make all links open in a new window ---- */
var links = document.links;
for (let i = 0, linksLength = links.length; i < linksLength; i++) {
    if (links[i].hostname !== window.location.hostname) {
        links[i].target = '_blank';
    }
}





(function (a) {
    a("body")
        .on("click", '[data-bs-toggle="lightbox"], [data-toggle="lightbox"]', function (b) {
            if (window.openBootstrapLightbox) {
                b.stopPropagation();
                b.preventDefault();
                window.openBootstrapLightbox(this);
            }
        })
})(window.$);


/* ---- Controls the currency selector form ---- */
$('.shopify-currency-form select').on('change', function () {
    $(this)
        .parents('form')
        .submit();
});


var containerEl = document.querySelector('.sorter');
var mixer;
jQuery(function () {
    $('.clear-filters')
        .parent()
        .removeClass('d-none')
        .find('.clear-filters')
        .hide();
    if (containerEl) {
        mixer = mixitup(containerEl, {
            multifilter: {
                enable: true
            },
            animation: {
                enable: false
            },
            selectors: {
                control: '[data-mixitup-control]'
            },
            callbacks: {
                onMixEnd: function (state) {
                    $('.count').html("" + state.totalShow + " Items");
                    $('.clear-filters, .edward').show();
                    $('.filter-error').hide();
                    if (state.activeFilter.selector === '.mix') {
                        $('.clear-filters, .edward').hide();
                        $('.edward').html();
                    }
                },
                onMixFail: function (state) {
                    $('.filter-error').show();
                }
            }
        });
        // Obtain an array of each `select` within a filter group
        var selects = Array.from(document.querySelectorAll('[data-filter-group] input'));

        function initSelect(select) {
            // Dispatch a `change` event from the select
            var ev = new CustomEvent('change', {bubbles: true});
            select.dispatchEvent(ev);
        }

        // Iterate through each select, calling the `initSelect` function
        selects.forEach(initSelect);
        // Re-enable animations after initial filter
        mixer.configure({
            animation: {
                enable: true
            }
        });
    }
});


$.fn.whoaSelectSort = function (elements, attr) {
    return $(this).each(function (i, container) {
        var items = $(container).find(elements);
        items.sort(function (a, b) {
            return +$(a).attr(attr) - +$(b).attr(attr)
        });
        items.appendTo(container)
    })
};


$('#sizeboxes').whoaSelectSort('li', 'data-sort-val');

$('#sizeboxes')
    .removeAttr('selected')
    .attr('selected', true);

$("#brands").hide();
$("#sizes").hide();
//$("#categories").hide();
$(document).on('click', '#clickbrands', function () {
    $(document).find("#brands").slideToggle();

    if ($(document).find("#sizes")[0].style.display != "none") {
        $(document).find("#sizes").slideToggle();
    }
    // if ($("#categories")[0].style.display != "none") {
    //     $("#categories").slideToggle();
    // }
})
$(document).on('click', "#clicksizes", function () {
    $(document).find("#sizes").slideToggle();

    if ($(document).find("#brands")[0].style.display != "none") {
        $(document).find("#brands").slideToggle();
    }
    // if ($("#categories")[0].style.display != "none") {
    //     $("#categories").slideToggle();
    //}
})
$(document).on('click', "#clickme", function () {
    //$("#categories").slideToggle();

    if ($(document).find("#sizes")[0].style.display != "none") {
        $(document).find("#sizes").slideToggle();
    }
    if ($(document).find("#brands")[0].style.display != "none") {
        $(document).find("#brands").slideToggle();
    }
})




$(document).on('change', 'form.filters-form input', function (e) {
    $(document).find('form.filters-form').submit();
});

updateFilterCount();

function updateFilterCount() {
    let targetIds = []

    $('[data-count-target]:disabled').prop('checked', false)

    $(document).find('input[data-count-target]').each(function () {
        let id = $(this).attr('data-count-target');
        if ($.inArray(id, targetIds) === -1) targetIds.push(id);
    })

    let showReset = false;
  	
    $.each(targetIds, function (index, id) {
        let count = $(document).find('[data-count-target="' + id + '"]:checked').length;

        //$('span[data-' + id + '-count]').text(count)

        if (count > 0) {
            showReset = true;
        }
      
      
      
      	if($(document).find('[data-count-target="' + id + '"]:checked').length > 0) {
          let selectedElem = $(document).find('[data-count-target="' + id + '"]:checked');
          let qtyCount = 0;
          $.each(selectedElem, function (index, elem) {
            console.log($(elem).data('count'));
    		qtyCount += $(elem).data('count');
          });
          
          $('span[data-' + id + '-count]').text(qtyCount)
      	}
 
    }); 

    if (showReset == true) {
        $('a.reset-filters').removeClass('d-none')
    } else {
        $('a.reset-filters').addClass('d-none')
    }
  
  if( typeof hideDisabled !== 'undefined' && hideDisabled == 'yes' ) {
    $('[data-count-target]:disabled').parents('li.list-item').hide();
  }
}

$(document).on('submit', 'form.filters-form', function (e) {
    e.preventDefault();

    let url = $(this).attr('action') + '?' + $(this).serialize();

    $(this).find('button').attr('disabled', 'disabled');

    filterResults(url)

    return false;
})


$(document).on('click', '.reset-filters', function (e) {
    e.preventDefault();

    $('input[data-count-target]').prop('checked', false);

    filterResults($(this).attr('href'))
});

$(document).on('click', '.remove-one-filter', function (e) {
    e.preventDefault();

    $('input[value="'+$(this).find('span.filter-value').text()+'"]').prop('checked', false);

    filterResults($(this).attr('href'))
});

function filterResults(url) {
    $('body, html').addClass('wait');
    $('.overlay').show();

    $.ajax({
        type: 'GET',
        url: url,
        data: {},
        success: function (data) {
            updateFilterCount();

            let parser = new DOMParser();
            let doc = parser.parseFromString(data, "text/html");
            let collection = doc.querySelector('div.collection-inner');

            $('div.collection-inner').empty().html(collection.innerHTML);

            $('body, html').removeClass('wait');
            $('.overlay').hide();

            updateSizeCount();

            history.pushState({
                page: url
            }, url, url);
        }
    });
}

function updateSizeCount()
{
    let uniqFilters = [];
    $.each(availableFilters, function (index, item) {
        if (uniqFilters.filter(e => e.title === item.title).length === 0) {
            uniqFilters.push({title: item.title, count: item.inventory_count});
        } else {
            uniqFilters.map(function (i) {
                if (i.title == item.title) {
                    i.count += item.inventory_count;
                }
                return i;
            })
        }
    })

    $.each(uniqFilters, (index, item) => {
        $('[data-item-count="'+item.title+'"]').text(item.count)
    })

    $('[data-count-target]:disabled').next('label').find('span').text(0);
}

(function ($) {
    updateSizeCount()
})(jQuery)


$(document).on('DOMNodeInserted', function(e) {
    if ( $(e.target).hasClass('collection-inner') ) {
        updateFilterCount();
        updateSizeCount();
    }
});







