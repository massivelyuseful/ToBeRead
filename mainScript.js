/**
 * Created with JetBrains WebStorm.
 * User: dan becker danbecke@uw.edu
 * Date: 3/22/13
 * Time: 12:10 PM
 * To change this template use File | Settings | File Templates.
 */

$(document).ready(function () {

    function myItem (itemTitle, imageURL)  {
        this.itemTitle = itemTitle;
        this.imageURL = imageURL;
    }

    var myItems = new Array();

    function addItem (anItem) {
        console.log("About to addItem", anItem.itemTitle, "at position" , myItems.length )
        myItems[myItems.length] = anItem;
    }

    // load list of books from a local XML file - handy for bootstrapping, mockups, & testing
    $("#load_xml_books").click(function(){
        $.ajax({
            url: "sampleBooks.xml",
            cache: false,
            dataType: "xml",
            success: function (xml) {
                var i = 0;
                $(xml).find("book").each(function() {
                        var img_url = $(this).find("imageURL").text();
                        var book_title = $(this).find("itemTitle").text();
                        addItem (new myItem(book_title, img_url));
//                        myItems[i] = new myItem(book_title, img_url);
                        i = i+1;
                    }
                );
            }
        });
    });

    // load books from specified Google Books shelf
    $("#load_google_books").click(function(){
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
                    addItem (new myItem(book_title, img_url));
                }
            }
        });
    });

    // handy way to clear data without reloading entire page
    $("#drop_items").click(function(){
        // remove displayed data
        for(var i = 0; i < myItems.length; i++ ) {
            var divID = "#itemTitle" + i;
            $(divID).text("") ;
            var imgID = "#cover" + i;
            $(imgID).attr("src", "");
        }
        myItems.length = 0; // empty the array
    });

    // output the current myItems to console.log
    $("#console_items").click(function(){
        console.log("Current contents of myItems:");
        for(var i = 0; i < myItems.length; i++ ) {
            console.log("  ", i, "|", myItems[i].itemTitle, "|",myItems[i].imageURL);
        }


    });

});
