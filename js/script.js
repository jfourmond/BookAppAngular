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

/*	TRAITEMENT DES DONNEES	*/
function treatmentItems(items) {
	var books = [];
	for(var item of items)
		books.push(treatmentItem(item));
	return books;
}

function treatmentItem(item) {
	var volume = item.volumeInfo;
	var isbn = treatmentISBN13(volume.industryIdentifiers);
	var title = volume.title;
	var author = treatmentAuthors(volume.authors);
	var publisher = volume.publisher;
	var publishedDate = volume.publishedDate;
	var description = volume.description;
	var pageCount = volume.pageCount;
	var thumbnail = null;
	if(volume.imageLinks)
	 	thumbnail = volume.imageLinks.thumbnail;
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
	if(authors == null) return null;
	var author = authors[0];
	for(var i=1; i < authors.size ; i++)
		author = author + ", " + authors[i];
	return author;
}
