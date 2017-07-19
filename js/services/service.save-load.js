'use strict';

angular.module("BookApp").service('saveLoad', function() {
	return {
		save: function(books) { localStorage.setItem('books', JSON.stringify(books)); },
		load: function() { return JSON.parse(localStorage.getItem('books')); },
		saved: function() { return localStorage.getItem('books') != null; }
	};
});
