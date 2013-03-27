/**
 * Created with JetBrains WebStorm.
 * User: dan becker danbecke@uw.edu
 * Date: 3/22/13
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
        // TODO: automatically display the books after loading the data
    });

    // load books from specified Google Books shelf
    $("#load_google_books").click(function(){
        // to get all the books from my public TBR shelf, I need to use a few things - hardcoding for now:
        // TODO: clean up hardcoding!
        // TODO: use OAuth 2 instead of API key
        // user ID (uid) =  114923424691622086388
        // shelf ID (as_coll) = 1001
        // API key =  AIzaSyArupT8Pq-t5lN2ke_CVtt6M9PgbfRigzM  TODO: move key from git source to unmanaged config file
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

        // TODO: automatically display the books after loading the data
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

    $("#load_lorempixel").click(function () {
        $('.galleryItem img').attr('src', "http://lorempixel.com/400/600/");
    });

    // output the current myItems to console.log
    $("#console_items").click(function(){
        console.log("Current contents of myItems:");
        for(var i = 0; i < myItems.length; i++ ) {
            console.log("  ", i, "|", myItems[i].itemTitle, "|",myItems[i].imageURL);
        }
    });

    $("#hide_items").click(function hide_all() {
        $('.galleryItem img').attr('src', "images/1x1-pixel.png");
    });

    $("#draw_items").click(function draw_all() {
        $('.galleryItem img').attr('src', "images/1x1-pixel.png");
        console.log("draw_all called; old images erased");
        // load images from myItems into gallery
        console.log("myItems.length is ", myItems.length);
        if (myItems.length === 0) {
            alert("No items to display. Try loading some.");
        }
        for(var i = 0; i < myItems.length; i++ ) {
            var divID = "#g" + i;
//            var selector = '"' + divID + ' img"' ;
            console.log(i, divID, myItems[i].imageURL);
            $(divID).children('img').attr('src', myItems[i].imageURL);
//            $(selector).attr('src', myItems[i].imageURL);
//            $(divID).img.attribute("src", myItems[i].imageURL);
        }
    });

});

