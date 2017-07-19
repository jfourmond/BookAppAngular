'use strict';

angular.module("BookApp").service('sendBook', function() {
	var bookSend = null;

	return {
		get: function() { return bookSend; },
		is: function() { return bookSend != null},
		set: function(book) { bookSend = book; }
	};
});
