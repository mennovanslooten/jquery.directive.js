(function (factory) {
	if (typeof module === 'object' && typeof module.exports === 'object') {
		factory(require('jquery'));
	} else {
		factory(jQuery);
	}
}(function($, undefined) {
	var _directive_setup = {};
	var _counter = 0;
	var $doc = $(document);


	/*
		jQuery.directive(name, callback) calls callback() for every element on the page
		that has name as an attribute or CSS class.

		This only has to be called once. It will then be called for every matching element,
		even elements that are added to the DOM later
	*/
	$.directive = function(name, callback) {
		var identifier = 'directive' + (_counter++);
		var is_class = /^\.\S+$/.test(name);
		var selector = is_class ? name : '[' + name.toLowerCase() + ']';

		function setup() {
			var $elt = $(this);

			// Don't re-initialize widgets
			if ($elt.data(identifier)) {
				return;
			}
			$elt.data(identifier, true);

			var attrs = getConvertedAttributes($elt);
			callback($elt, attrs);
		}

		_directive_setup[selector] = setup;

		rescan($doc);
	};


	function rescan($roots) {
		$.each(_directive_setup, function(selector, setup) {
			$roots.filter(selector).each(setup);
			$roots.find(selector).each(setup);
		});
	}


	// Enhance jQuery DOM methods to add scanning for elements that match
	// directives
	var old_before = $.fn.before;
	$.fn.before = function() {
		var result = old_before.apply(this, arguments);
		rescan(this.prevAll());
		return result;
	};


	var old_after = $.fn.after;
	$.fn.after = function() {
		var result = old_after.apply(this, arguments);
		rescan(this.nextAll());
		return result;
	};


	$.each(['append', 'prepend', 'html'], function(i, method) {
		var oldMethod = $.fn[method];
		$.fn[method] = function() {
			var result = oldMethod.apply(this, arguments);
			rescan(this);
			return result;
		};
	});


	$(function() {
		rescan($doc);
	});


	function getConvertedAttributes($elt) {
		var attributes = {};

		$.each($elt[0].attributes, function(index, attr) {
			if (attr.specified) {
				try {
					var json = JSON.parse(attr.value);
					attributes[attr.name] = json;
				} catch (ex) {
					var value = attr.value;
					var int = parseInt(value, 10);
					var float = parseFloat(value);

					if (value === 'true' || value === 'false') {
						value = !!value;
					} else if (int.toString() === value) {
						value = int;
					} else if (float.toString() === value) {
						value = float;
					}

					attributes[attr.name] = value;
				}
			}
		});

		return attributes;
	}


}));

