'use strict';

angular.module("BookApp").service('settings', function() {
	return {
		save: function(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
		load: function(key) { return JSON.parse(localStorage.getItem(key)); },
		saved: function(key) { return localStorage.getItem(key) != null; }
	};
});
