/**
 * Created with JetBrains WebStorm.
 * User: dan becker danbecke@uw.edu
 * Date: 3/22/13
 * Time: 12:10 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function () {

    function myBook (bookTitle, coverImageURL)  {
        this.bookTitle = bookTitle;
        this.coverImageURL = coverImageURL;
    }

    var myBooks = new Array();

    function addBook (aBook) {
        console.log("About to addBook", aBook.bookTitle, "at position" , myBooks.length )
        myBooks[myBooks.length] = aBook;
    }

    // load list of books from a local XML file - handy for bootstrapping, mockups, & testing
    $("#load_xml").click(function(){
        $.ajax({
            url: "sampleBooks.xml",
            cache: false,
            dataType: "xml",
            success: function (xml) {
                var i = 0;
                $(xml).find("book").each(function() {
                        var img_url = $(this).find("coverImageURL").text();
                        var book_title = $(this).find("bookTitle").text();
                        addBook (new myBook(book_title, img_url));
//                        myBooks[i] = new myBook(book_title, img_url);
                        i = i+1;
                    }
                );
            }
        });
    });

    // load books from specified Google Books shelf
    $("#load_google").click(function(){
        // to get all the books from my public TBR shelf, I need to use a few things - hardcoding for now:
        // TODO: clean up hardcoding!
        // TODO: use OAuth 2 instead of API key
        // TODO: specify all this in an XML manifest; write a general book loader that takes an XML manifest and loads books according to its instruction....?
        // user ID (uid) =  114923424691622086388
        // shelf ID (as_coll) = 1001
        // API key =  AIzaSyArupT8Pq-t5lN2ke_CVtt6M9PgbfRigzM
        // https://www.googleapis.com/books/v1/users/1112223334445556677/bookshelves/3/volumes?key=yourAPIKey
        // https://www.googleapis.com/books/v1/users/114923424691622086388/bookshelves/1001/volumes?key=AIzaSyArupT8Pq-t5lN2ke_CVtt6M9PgbfRigzM


        $.getJSON('https://www.googleapis.com/books/v1/users/114923424691622086388/bookshelves/1001/volumes?key=AIzaSyArupT8Pq-t5lN2ke_CVtt6M9PgbfRigzM', function(json) {
            if (json.items) {
                // why am I using traditional for (i = 0, i < end, i++) iterator instead of using .each?
                for (var i = 0; i < json.items.length; i++) {
                    var book_title = json.items[i].volumeInfo.title;
                    var img_url = json.items[i].volumeInfo.imageLinks.thumbnail;
                    addBook (new myBook(book_title, img_url));
                }
            }
        });
    });

    // handy way to clear data without reloading entire page
    $("#drop_books").click(function(){
        // remove displayed data
        for(var i = 0; i < myBooks.length; i++ ) {
            var divID = "#bookTitle" + i;
            $(divID).text("") ;
            var imgID = "#cover" + i;
            $(imgID).attr("src", "");
        }
        myBooks.length = 0; // empty the array
    });

    // output the current myBooks to console.log
    $("#console_books").click(function(){
        console.log("Current contents of myBooks:");
        for(var i = 0; i < myBooks.length; i++ ) {
            console.log("  ", i, "|", myBooks[i].bookTitle, "|",myBooks[i].coverImageURL);
        }


    });

});
