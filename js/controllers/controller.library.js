'use strict';

angular.module("BookApp").controller('LibraryCtrl', function ($scope, $http, sendBook, saveLoad) {
	/*	SNACKBAR */
	var snackBar = document.querySelector("#snackbar");
	// INITIALISATION OU CHARGEMENT DES DONNEES
	if(saveLoad.saved())
		$scope.books = saveLoad.load();
	else
		$scope.books = [ ];
	// AJOUT D'UN LIVRE
	$scope.addBook = function (book) {
		console.log("Ajout du livre : %O", book);
		$scope.books.push(book);
		var dataSnackbarAdded = {
			message: book.title + " ajouté",
			actionHandler: function(event) {
				console.log("Annulation de l'ajout du livre : %O", book);
				var index = $scope.books.indexOf(book);
				$scope.books.splice(index, 1);
				$scope.$apply();
				snackbar.MaterialSnackbar.cleanup_();
				saveLoad.save($scope.books);
			},
			actionText: 'Annuler',
			timeout: 10000
		};
		snackBar.MaterialSnackbar.showSnackbar(dataSnackbarAdded);
		saveLoad.save($scope.books);
	};
	// FAVORISATION D'UN LIVRE
	$scope.favoriteBook = function(book) {
		if(book.favorite) {
			console.log("Défavorisation du livre : %O", book);
			book.favorite = false;
		} else {
			console.log("Favorisation du livre : %O", book);
			book.favorite = true;
		}
		saveLoad.save($scope.books);
	};
	// TRI DES LIVRES
	$scope.sort = function(x) {
		console.log("Sort on : %O", x);
		$scope.myOrder = x;
	};
	// VIDAGE DE LA BIBLIOTHEQUE
	$scope.clear = function() {
		console.log("Vidage de la bibliothèque");
		$scope.books = $scope.books = [];
		saveLoad.save($scope.books);
	}
	// AFFICHAGE DE LA FICHE COMPLETE D'UN LIVRE
	$scope.showBook = function(book) {
		console.log("Affichage du livre : %O", book);
		sendBook.set(book);
	};
	// SUPPRESSION D'UN LIVRE
	$scope.removeBook = function (book) {
		console.log("Suppression du livre : %O", book);
		var index = $scope.books.findIndex(b => b.isbn == book.isbn);
		$scope.books.splice(index, 1);
		var dataSnackbarDeleted = {
			message: book.title + " supprimé",
			actionHandler: function(event) {
				console.log("Annulation de la suppression du livre : %O", book);
				$scope.books.splice(index, 0, book);
				$scope.$apply();
				snackbar.MaterialSnackbar.cleanup_();
				saveLoad.save($scope.books);
			},
			actionText: 'Annuler',
			timeout: 10000
		};
		snackbar.MaterialSnackbar.showSnackbar(dataSnackbarDeleted);
		saveLoad.save($scope.books);
	};
	//	IMPORTATION DE LA BIBLIOTHEQUE
	$scope.onFileImported = function(files) {
		console.log("Importation d'une bibliothèque");
		var file = files.files[0];
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			if(evt.target.readyState === FileReader.DONE) {
				var list = JSON.parse(evt.target.result);
				for(var l of list)
					$scope.books.push(Object.assign(new Book, l));
				$scope.$apply();
				saveLoad.save($scope.books);
			}
		}
		reader.readAsText(file);
	};
	//	EXPORTATION DE LA BIBLIOTHEQUE
	$scope.exportLibrary = function() {
		console.log("Exportation de la bibliothèque")
		var jsonData = angular.toJson($scope.books, true);
		var blob = new Blob([jsonData],{
			type: "application/json;charset=utf-8;"
		});
		var downloadLink = document.createElement('a');
		downloadLink.setAttribute('download', 'Library.json');
		downloadLink.setAttribute('href', window.URL.createObjectURL(blob));
		downloadLink.click();
	};
	if(sendBook.is()) {
		var book = sendBook.get();
		if(sendBook.isAddition())
			$scope.addBook(book);
		else
			$scope.removeBook(book);
		sendBook.set(null);
	}
});
