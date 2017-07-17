'use strict';

/*	PROGRESS BAR	*/
var spinner = document.querySelector("#spinner");

/*	CONTROLLER	*/
angular.module("BookApp").controller('SearchCtrl', function ($scope, $http) {
	// INITIALISATION
	$scope.books = [ ];
	//	RECHERCHE DE LIVRES CORRESPONDANT A L'ISBN
	$scope.search = function() {
		if($scope.isbn) {
			var isbn = $scope.isbn;
			var isbn = isbn.replace('-', '');	// Suppression du caractère obsolète '-'
			console.log("Recherche de l'ISBN : " + isbn);
			spinner.hidden = false;
			$http.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
				.then(function success(response) {
					var data = response.data;
					console.log("Réponse de l'API : %O", response.data);
					if(data.totalItems != 0) {
						$scope.books = treatmentItems(data.items);
						console.log("Books : %O", $scope.books);
					} else {
						$scope.books = [ ];
						console.log("Aucun livre ne correspond à l'isbn " +  isbn);
					}
					spinner.hidden = true;
				}, function failure(response) {
					console.log("ECHEC");
					spinner.hidden = true;
				});
		}
	}
	// AJOUT DU LIVRE
	$scope.addBook = function(book) {
		console.log("Ajout du livre : %O", book);
	}
	// TRI DES LIVRES
	$scope.sort = function(x) {
		console.log("Sort on : %O", x);
		$scope.myOrder = x;
	};
});
