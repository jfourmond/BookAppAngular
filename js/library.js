'use strict';

/*	PROGRESS BAR */
var spinner = document.querySelector("#spinner");

/*	TOAST ET SNACKBAR	*/
var snackbar = document.querySelector('#snackbar');

/*	DIALOG	*/
var recordDialog = document.querySelector('#record-dialog');
if(!recordDialog.showModal)
	dialogPolyfill.registerDialog(recordDialog);
recordDialog.querySelector(".close").addEventListener('click', function() {
	recordDialog.close();
})

bookApp.controller('LibraryCtrl', function ($scope, $http) {
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
	$scope.addBook = function () {
		if($scope.addBookForm.$valid) {
			var isbn = addBookForm.isbn.value;
			var isbn = isbn.replace('-', '');
			console.log("Recherche de l'ISBN : " + isbn);
			spinner.hidden = false;
			$http.get("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn)
				.then(function success(response) {
					var data = response.data;
					console.log("Réponse de l'API : %O", response.data);
					if(data.totalItems != 0) {
						var newBook = treatmentItems(data.items);
						console.log("Ajout du livre : %O", newBook);
						$scope.books.push(newBook);
						var dataSnackbarAdded = {
							message: newBook.title + " ajouté",
							actionHandler: function(event) {
								console.log("Annulation de l'ajout du livre : %O", newBook);
								var index = $scope.books.indexOf(newBook);
								$scope.books.splice(index, 1);
								$scope.$apply();
								snackbar.MaterialSnackbar.cleanup_()
							},
							actionText: 'Annuler',
							timeout: 10000
						};
						addDialog.close();
						snackbar.MaterialSnackbar.showSnackbar(dataSnackbarAdded);
						addBookForm.reset();
						localStorage.setItem('books', JSON.stringify($scope.books));
					} else {
						console.log("Aucun livre ne correspond à l'isbn " +  isbn);
					}
					spinner.hidden = true;
				}, function failure(response) {
					spinner.hidden = true;
				});
		}
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
		inputFile.value = null;
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
});