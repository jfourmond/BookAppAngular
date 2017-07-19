'use strict';

angular.module("BookApp").service('sendBook', function() {
	var bookSend = null;
	var addition = null;

	return {
		get: function() { return bookSend; },
		is: function() { return bookSend != null; },
		isAddition : function() { return addition; },
		set: function(book, isAddition) {
			bookSend = book;
			addition = isAddition;
		},
		reset: function() {
			bookSend = null;
			addition = null;
		}
	};
});
