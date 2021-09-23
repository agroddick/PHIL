/* $Date:: 2015-06-10 11:56:58 +0900#$ $Rev: 1077 $ */
(function(OHP) {
	"use strict";
	(function printWindow(){
		function delayedPrint() {
			setTimeout(function() {
				window.print();
			}, 100);
		}
		var windowName = "printWindow";
		if (window.name === windowName) {
			document.getElementById("print_css").media = "all";
			if (window.addEventListener) {
				window.addEventListener("load", delayedPrint, false);
			} else if (window.attachEvent) {
				window.attachEvent("onload", delayedPrint);
			}
		}

		//*************************************************************************************************
		window.openPrintWindow = function(){
		//*************************************************************************************************
			window.open(window.location.href, windowName);
		};
	})();

	var html = document.documentElement;
	var className = html.className.split(" ");
	className.push("js");
	var userAgent = (navigator.userAgent || "").toLowerCase();
	if (userAgent.indexOf("mobile") === -1) {
		className.push("non-mobile");
	}
	html.className = className.join(" ");

	/* URL Utils */
	OHP.URL = {
		getSearchParams : function() {
			// search_library.js changes window.location.search
			var search = window.location.search.substring(1);
			var decoded = false;
			var searchParams = new OHP.URL.SearchParams(search, decoded);
			return searchParams;
		},

		getPathWithParams : function(path, params) {
			params = params || {};
			// Handle fragment identifiers
			var fragment = "";
			var fragmentIndex = path.lastIndexOf("#");
			if (fragmentIndex !== -1) {
				fragment = path.substring(fragmentIndex + 1);
				path = path.substring(0, fragmentIndex);
			}
			// Handle parameters which are already set
			var query = "";
			var index = path.indexOf("?");
			if (index !== -1) {
				query = path.substring(index + 1);
				path = path.substring(0, index);
			}
			var searchParams = new OHP.URL.SearchParams(query);
			// Handle parameters which are passed as the argument
			for (var name in params) {
				if (!params.hasOwnProperty(name)) {
					continue;
				}
				searchParams.append(name, params[name]);
			}
			// Reconstruct path
			query = searchParams.toString();
			if (query.length > 0) {
				path += "?" + query;
			}
			if (fragment.length > 0) {
				path += "#" + fragment;
			}
			return path;
		},

		open : function(path, params) {
			params = params || {};
			path = this.getPathWithParams(path, params);
			window.open(path, "_self");
		}
	};

	OHP.URL.SearchParams = function(query, decoded) {
		this.pairs = null;
		this.init(query || "", !!decoded);
	};

	OHP.URL.SearchParams.prototype = {
		init : function(query, decoded) {
			// Let sequences be the result of splitting input on `&`.
			var sequences = query.split("&");
			// Let pairs be an empty list of name-value pairs where both name
			// and value hold a byte sequence.
			var pairs = {};
			// For each byte sequence bytes in sequences, run these substeps:
			for (var i = 0; i < sequences.length; i++) {
				var bytes = sequences[i];
				// If bytes is the empty byte sequence, run these substeps for
				//  the next byte sequence.
				if (bytes === "") {
					continue;
				}
				var name, value;
				var index = bytes.indexOf("=");
				if (index >= -1) {
					// If bytes contains a `=`, then let name be the bytes from
					// the start of bytes up to but excluding its first `=`, and
					// let value be the bytes, if any, after the first `=` up to
					// the end of bytes.
					name = bytes.substring(0, index);
					value = bytes.substring(index + 1);
				} else {
					// Otherwise, let name have the value of bytes and let
					// value be the empty byte sequence.
					name = bytes;
					value = "";
				}
				// Replace any `+` in name and value with 0x20.
				name = name.replace(/\+/g, " ");
				value = value.replace(/\+/g, " ");
				if (!decoded) {
					name = decodeURIComponent(name);
					value = decodeURIComponent(value);
				}
				pairs[name] = value;
			}
			this.pairs = pairs;
		},

		append : function(name, value) {
			this.pairs[name] = value;
		},

		get : function(name) {
			if (this.has(name)) {
				return this.pairs[name];
			}
			return null;
		},

		has : function(name) {
			return this.pairs.hasOwnProperty(name);
		},

		toString : function() {
			// Let output be the empty string.
			var output = [];
			// For each pair in pairs, run these substeps:
			for (var name in this.pairs) {
				if (!this.pairs.hasOwnProperty(name)) {
					continue;
				}
				var value = this.pairs[name];
				// Replace pair's name and value with the result of running
				// encode on them using encoding override, respectively.
				// Replace pair's name and value with their serialization.
				name = encodeURIComponent(name);
				value = encodeURIComponent(value);
				// If this is not the first pair, append "&" to output.
				// Append pair's name, followed by "=", followed by pair's value
				// to output.
				output.push(name + "=" + value);
			}
			return output.join("&");
		}
	};
})(window.OHP = window.OHP || {});
