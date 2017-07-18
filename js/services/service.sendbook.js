'use strict';

angular.module("BookApp").service('sendBook', function() {
	var bookSend = null;

	return {
		get: function() { return bookSend; },
		set: function(book) { bookSend= book; }
	};
});
