'use strict';

angular.module("BookApp").controller('BookCtrl', function ($scope, $http, $routeParams, sendBook, saveLoad) {
	//	FAVORISATION DU LIVRE
	$scope.favorite = function() {
		if($scope.book.favorite) {
			console.log("Défavorisation du livre");
			$scope.book.favorite = false;
		} else {
			console.log("Favorisation du livre");
			$scope.book.favorite = true;
		}
		books.splice(index, 1, $scope.book);
		saveLoad.save(books);
	};
	//	SUPPRESSION DU LIVRE
	$scope.remove = function() {
		console.log("Suppression du livre");
		sendBook.set($scope.book, false);
		window.location.href = "#!home";
	}

	//	INITIALISATION
	var isbn = $routeParams.isbn;
	var books = saveLoad.load();
	var index = books.findIndex(b =>b.isbn == isbn);
	$scope.book = books[index];
	//	REDIRECTION SI AUCUN LIVRE NE CORRESPOND
	if($scope.book == null)
		window.location.href = "#!home";
});
