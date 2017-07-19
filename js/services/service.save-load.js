'use strict';

angular.module("BookApp").service('saveLoad', function() {
	return {
		save: function(books) { localStorage.setItem('books', JSON.stringify(books)); },
		load: function() {
			var books = [];
			for(var obj of JSON.parse(localStorage.getItem('books')))
				books.push(Object.assign(new Book, obj));
			return books;
		},
		saved: function() { return localStorage.getItem('books') != null; }
	};
});
