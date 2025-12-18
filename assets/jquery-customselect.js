/*
	Custom Select
	by:		Bill Kurtson
	mail:	bill@shopifyninjas.com
	date:	2015-07-06 (Dalai Lama's birthday!)
*/
if( typeof Object.create !== 'function' ) {
	Object.create = function(obj) {
		function F(){};
		F.prototype = obj;
		return new F();
	}
}

(function($) {

// plugin object
var CustomSelect = {
	init: function(options, elem) {
		var self = this;

		self.elem = elem;
		self.$elem = $(elem).hide();

		self.options = $.extend({}, $.fn.customSelect.options, options);

		self.selectOptions = [];

		self.createDropdown();
		self.setCurrentOption();
		self.updateStyling();
		self.bindEvents();
	},
	createDropdown: function() {
		var self = this;

		self.DropdownWrap = $('<div>', {
			class: "custom-select-wrap"
		}),
		self.Dropdown = $('<ul>', {
			class: "custom-select-dropdown"
		}),
		self.SelectedOption = $('<div>', {
			class: "custom-select selected-option"
		});
		self.DropdownArrow = $('<div>', {
			class: "custom-select-arrow",
			html: "&#x25B2;<br>&#x25BC;"
		});

		self.$elem.find("option").each(function(i) {
			var $this = $(this),
				newText = (self.options.showText) ? $this.text() : "",
				targetId = "custom-select-target-" + i,
				listOption = $('<li>', {
					text: newText,
					class: $this.attr("value") + "-currency",
					"data-target": targetId
				});

			$this.attr("id", targetId);

			listOption.appendTo(self.Dropdown);

			var option = {
				elem: listOption,
				target: targetId,
				value: $this.attr("value"),
				text: $this.text()
			};

			self.selectOptions.push(option);
		});

		self.Dropdown.appendTo(self.DropdownWrap).hide();
		self.SelectedOption.prependTo(self.DropdownWrap);
		self.DropdownArrow.insertAfter(self.SelectedOption);
		self.DropdownWrap.insertBefore(self.$elem);
	},
	setCurrentOption: function() {
		var self = this,
			activeElemSelector = self.$elem.val() + "-currency";

		if( self.options.showText ) {
			var currentVisualValue = self.getCurrentVisualValue();
			self.SelectedOption.text(currentVisualValue);
		}

		for(var i = 0; i < self.selectOptions.length; i++) {
			self.SelectedOption.removeClass( self.selectOptions[i].value + "-currency" );
			self.selectOptions[i].elem.removeClass('active');
		}

		var option = self.$elem.find("option[value='" + self.$elem.val() + "']"),
				bgUrl = $(option).data("bg");

		self.SelectedOption.css({
			"background-image": "url(" + bgUrl + ")"
		});

		$('.' + activeElemSelector).addClass('active');
	},
	getCurrentVisualValue: function() {
		var self = this,
				option = self.$elem.find("option[value='" + self.$elem.val() + "']");

		return option.text();
	},
	bindEvents: function() {
		var self = this;

		// close the dropdown when user clicks outside
		$(document).on("click", function(e) {
			self.Dropdown.hide();
		});

		// set click events for options
		for(var i = 0; i < self.selectOptions.length; i++) {

			(function() {
				var obj = self.selectOptions[i],
					target = obj.target;

				self.selectOptions[i].elem.on("click", function(e) {

					self.$elem
						.val(obj.value)
						.trigger("change");

					self.setCurrentOption.call(self);
				});
			})();
		}

		// set click event for dropdown
		self.DropdownWrap.on("click", function(e) {
			e.stopPropagation(); // stop the dropdown from closing by the document click event
			self.Dropdown.toggle();
		});
	},
	updateStyling: function() {
		var self = this;

		// set backgrounds
		var customOptions = self.Dropdown.children("li");

		$.each(customOptions, function() {
			var obj = $(this),
				bgUrl = self.getBackgroundImage(obj);

			obj.css({
				'background-image': "url('" + bgUrl + "')"
			});
		});

		if(self.options.showText) {
			// widen the dropdown and push the text to the right
			$('.custom-select-wrap').addClass('custom-select-has-text');
		}
	},
	getBackgroundImage: function(option) {
		var targetId = option.data("target"),
			target = $("#" + targetId);

		return $(target).data("bg");
	}
};

// plugin definition
$.fn.customSelect = function(options) {
	return this.each(function() {
		var custom = Object.create(CustomSelect);
		custom.init(options, this);
	});
}

// default options for customSelect
$.fn.customSelect.options = {
	showText: true
};

}(jQuery));