'use strict';

/*	CLASSE	*/
class Book {
	constructor(isbn, title, author, publisher, publishedDate, description, pageCount, thumbnail, favorite, addedDate) {
		this.isbn = isbn;
		this.title = title;
		this.author = author;
		this.publisher = publisher;
		this.publishedDate = publishedDate;
		this.description = description;
		this.pageCount = pageCount;
		this.thumbnail = thumbnail;
		this.favorite = favorite;
		this.addedDate = addedDate;
	}
}

var b1 = new Book("9780545010221", "Harry Potter and the Deathly Hallows", "J. K. Rowling", "Arthur a Levine",
	2007, "The magnificent final book in J. K. Rowling's seven-part saga comes to readers July 21, 2007. You'll find out July 21!",
	759, "http://books.google.com/books/content?id=GZAoAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api", true, new Date()
);

var b2 = new Book("9781551927282", "Harry Potter and the Philosopher's Stone", "J. K. Rowling", null , "2004-10-04",
	"Funny, imaginative, magical ... Rowling has woken up a whole generation to reading. In the 2020s, thirty-something book-lovers will know each other by smug references to Diagon Alley and Quidditch.",
	336, null, false, new Date()
);

var b3 = new Book("9782857046837", "La citadelle des ombres", "Robin Hobb", "Pygmalion Editions", "2001-03-03",
	"Aujourd'hui, en France et à l'étranger, La Citadelle des Ombres est unanimement salué comme l'un des chefs-d'œuvre de la littérature fantastique du XXe siècle, à tel point que certains le comparent au Seigneur des anneaux de J. R. R. Tolkien.",
	898, null, false, new Date()
);

/*	PROGRESS BAR */
var spinner = document.querySelector("#spinner");

/*	TOAST ET SNACKBAR	*/
var snackbar = document.querySelector('#snackbar');

/*	DIALOG	*/
var addDialog = document.querySelector('#add-dialog');
var addButton = document.querySelector('#add-button');
if(!addDialog.showModal)
	dialogPolyfill.registerDialog(addDialog);
addButton.addEventListener('click', function() { addDialog.showModal(); });
addDialog.querySelector('.close').addEventListener('click', function() {
	addDialog.close();
});

var recordDialog = document.querySelector('#record-dialog');
if(!recordDialog.showModal)
	dialogPolyfill.registerDialog(recordDialog);
recordDialog.querySelector(".close").addEventListener('click', function() {
	recordDialog.close();
})

/*	TRAITEMENT DES DONNEES	*/
function treatmentItems(items) {
	// console.log(items);
	var volume = items[0].volumeInfo;
	var isbn = treatmentISBN13(volume.industryIdentifiers);
	var title = volume.title;
	var author = treatmentAuthors(volume.authors);
	var publisher = volume.publisher;
	var publishedDate = volume.publishedDate;
	var description = volume.description;
	var pageCount = volume.pageCount;
	var thumbnail = volume.imageLinks.thumbnail;
	var favorite = false;
	var addedDate = new Date();
	return new Book(isbn, title, author, publisher, publishedDate, description, pageCount, thumbnail, favorite, addedDate);
}

function treatmentISBN13(industryIdentifiers) {
	var isbn;
	for(var id of industryIdentifiers)
		if(id.type == "ISBN_13")
			isbn = id.identifier;
	return isbn;
}

function treatmentAuthors(authors) {
	var author = authors[0];
	for(var i=1; i < authors.size ; i++)
		author = author + ", " + authors[i];
	return author;
}


/*	APP	*/
var bookApp = angular.module("BookApp", []);
bookApp.controller('BookCtrl', function ($scope, $http) {
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
});
