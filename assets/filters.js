var containerEl = document.querySelector('.sorter');
var mixer;

jQuery(function() {
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
        onMixEnd: function(state) {
          $('.count').html("" + state.totalShow + " Items");
          $('.clear-filters, .edward').show();
          $('.filter-error').hide();
          if (state.activeFilter.selector === '.mix') {
            $('.clear-filters, .edward').hide();
            $('.edward').html();
          }
        },
        onMixFail: function(state) {
          $('.filter-error').show();
        }
      }
    });

    var selects = Array.from(document.querySelectorAll('[data-filter-group] input'));

    function initSelect(select) {
      var ev = new CustomEvent('change', { bubbles: true });
      select.dispatchEvent(ev);
    }

    selects.forEach(initSelect);

    mixer.configure({
      animation: {
        enable: true
      }
    });
  }
});

$.fn.whoaSelectSort = function(elements, attr) {
  return $(this).each(function(i, container) {
    var items = $(container).find(elements);
    items.sort(function(a, b) {
      return +$(a).attr(attr) - +$(b).attr(attr);
    });
    items.appendTo(container);
  });
};

$('#sizeboxes').whoaSelectSort('li', 'data-sort-val');
$('#sizeboxes').removeAttr('selected').attr('selected', true);

$("#brands").hide();
$("#sizes").hide();

$(document).on('click', '#clickbrands', function() {
  $(document).find("#brands").slideToggle();
  if ($(document).find("#sizes")[0].style.display != "none") {
    $(document).find("#sizes").slideToggle();
  }
});

$(document).on('click', "#clicksizes", function() {
  $(document).find("#sizes").slideToggle();
  if ($(document).find("#brands")[0].style.display != "none") {
    $(document).find("#brands").slideToggle();
  }
});

$(document).on('click', "#clickme", function() {
  if ($(document).find("#sizes")[0].style.display != "none") {
    $(document).find("#sizes").slideToggle();
  }
  if ($(document).find("#brands")[0].style.display != "none") {
    $(document).find("#brands").slideToggle();
  }
});

$(document).on('change', 'form.filters-form input', function(e) {
  $(document).find('form.filters-form').submit();
});

updateFilterCount();

function updateFilterCount() {
  var targetIds = [];

  $('[data-count-target]:disabled').prop('checked', false);

  $(document).find('input[data-count-target]').each(function() {
    var id = $(this).attr('data-count-target');
    if ($.inArray(id, targetIds) === -1) targetIds.push(id);
  });

  var showReset = false;

  $.each(targetIds, function(index, id) {
    var count = $(document).find('[data-count-target="' + id + '"]:checked').length;

    if (count > 0) {
      showReset = true;
    }

    if ($(document).find('[data-count-target="' + id + '"]:checked').length > 0) {
      var selectedElem = $(document).find('[data-count-target="' + id + '"]:checked');
      var qtyCount = 0;
      $.each(selectedElem, function(index, elem) {
        qtyCount += $(elem).data('count');
      });
      $('span[data-' + id + '-count]').text(qtyCount);
    }
  });

  if (showReset == true) {
    $('a.reset-filters').removeClass('d-none');
  } else {
    $('a.reset-filters').addClass('d-none');
  }

  if (typeof hideDisabled !== 'undefined' && hideDisabled == 'yes') {
    $('[data-count-target]:disabled').parents('li.list-item').hide();
  }
}

$(document).on('submit', 'form.filters-form', function(e) {
  e.preventDefault();

  var url = $(this).attr('action') + '?' + $(this).serialize();
  $(this).find('button').attr('disabled', 'disabled');
  filterResults(url);

  return false;
});

$(document).on('click', '.reset-filters', function(e) {
  e.preventDefault();
  $('input[data-count-target]').prop('checked', false);
  filterResults($(this).attr('href'));
});

$(document).on('click', '.remove-one-filter', function(e) {
  e.preventDefault();
  $('input[value="' + $(this).find('span.filter-value').text() + '"]').prop('checked', false);
  filterResults($(this).attr('href'));
});

function filterResults(url) {
  $('body, html').addClass('wait');
  $('.overlay').show();

  $.ajax({
    type: 'GET',
    url: url,
    data: {},
    success: function(data) {
      updateFilterCount();

      var parser = new DOMParser();
      var doc = parser.parseFromString(data, "text/html");
      var collection = doc.querySelector('div.collection-inner');

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

function updateSizeCount() {
  var uniqFilters = [];
  $.each(availableFilters, function(index, item) {
    if (uniqFilters.filter(function(e) { return e.title === item.title; }).length === 0) {
      uniqFilters.push({ title: item.title, count: item.inventory_count });
    } else {
      uniqFilters.map(function(i) {
        if (i.title == item.title) {
          i.count += item.inventory_count;
        }
        return i;
      });
    }
  });

  $.each(uniqFilters, function(index, item) {
    $('[data-item-count="' + item.title + '"]').text(item.count);
  });

  $('[data-count-target]:disabled').next('label').find('span').text(0);
}

(function($) {
  updateSizeCount();
})(jQuery);
