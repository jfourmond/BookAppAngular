'use strict';

angular.module("BookApp").controller('LibraryCtrl', function ($scope, $http, sendBook) {
	/*	SNACKBAR */
	var snackBar = document.querySelector("#snackbar");
	/*	DIALOG	*/
	var recordDialog = document.querySelector('#record-dialog');
	if(!recordDialog.showModal)
		dialogPolyfill.registerDialog(recordDialog);
	recordDialog.querySelector(".close").addEventListener('click', function() {
		recordDialog.close();
	});
	// INITIALISATION OU CHARGEMENT DES DONNEES
	if(localStorage.getItem('books') != null) {
		var objs = [];
		for(var obj of JSON.parse(localStorage.getItem('books'))){
			objs.push(Object.assign(new Book, obj));
		}
		console.log("%O", objs);
		$scope.books = objs;
	} else {
		$scope.books = [ ];
	}
	// AJOUT D'UN LIVRE
	$scope.addBook = function (book) {
		console.log("Ajout du livre : %O", newBook);
		$scope.books.push(book);
		var dataSnackbarAdded = {
			message: newBook.title + " ajouté",
			actionHandler: function(event) {
				console.log("Annulation de l'ajout du livre : %O", newBook);
				var index = $scope.books.indexOf(newBook);
				$scope.books.splice(index, 1);
				$scope.$apply();
				snackbar.MaterialSnackbar.cleanup_();
				localStorage.setItem('books', JSON.stringify($scope.books));
			},
			actionText: 'Annuler',
			timeout: 10000
		};

		snackBar.MaterialSnackbar.showSnackbar(dataSnackbarAdded);
		localStorage.setItem('books', JSON.stringify($scope.books));
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
		localStorage.setItem('books', JSON.stringify($scope.books));
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
		localStorage.setItem('books', JSON.stringify($scope.books));
	}
	// AFFICHAGE DE LA FICHE COMPLETE D'UN LIVRE
	$scope.showBook = function(book) {
		console.log("Affichage du livre : %O", book);
		recordDialog.querySelector("#title").innerText = book.title;
		recordDialog.querySelector("#author").innerText = book.author;
		recordDialog.querySelector("#isbn").innerText = book.isbn + " - " + book.publisher;
		if(book.thumbnail) {
			recordDialog.querySelector("#cover").src = book.thumbnail;
			recordDialog.querySelector("#cover").alt = book.title + " cover";
		} else
			recordDialog.querySelector("#cover").hidden = true;
		recordDialog.querySelector("#description").innerText = book.description;
		recordDialog.showModal();
	};
	// SUPPRESSION D'UN LIVRE
	$scope.removeBook = function (book) {
		console.log("Suppression du livre : %O", book);
		var index = $scope.books.indexOf(book);
		$scope.books.splice(index, 1);
		var dataSnackbarDeleted = {
			message: book.title + " supprimé",
			actionHandler: function(event) {
				console.log("Annulation de la suppression du livre : %O", book);
				$scope.books.splice(index, 0, book);
				$scope.$apply();
				snackbar.MaterialSnackbar.cleanup_();
				localStorage.setItem('books', JSON.stringify($scope.books));
			},
			actionText: 'Annuler',
			timeout: 10000
		};
		snackbar.MaterialSnackbar.showSnackbar(dataSnackbarDeleted);
		localStorage.setItem('books', JSON.stringify($scope.books));
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
			}
		}
		reader.readAsText(file);
		localStorage.setItem('books', JSON.stringify($scope.books));
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

	if(sendBook.get() != null) {
		var newBook = sendBook.get();
		console.log(newBook);
		$scope.addBook(newBook);
	}
});
