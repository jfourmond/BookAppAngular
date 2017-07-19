'use strict';

angular.module("BookApp").controller('BookCtrl', function ($scope, $http, $routeParams, sendBook, saveLoad) {
	var isbn = $routeParams.isbn;
	for(var obj of saveLoad.load()) {
		if(isbn == obj.isbn) {
			$scope.book = Object.assign(new Book, obj);
			break;
		}
	}
	console.log($scope.book);

});
