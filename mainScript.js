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

    // load books from user's 'to read' shelf on Google Books; uses OAuth
    // following example at https://code.google.com/p/google-api-javascript-client/source/browse/samples/authSample.html
    $("#load_google_books").click(function(){
        // TODO: allow selecting arbitrary shelf instead of only using the built-in 'to-read' shelf
        var myAPIkey = 'AIzaSyArupT8Pq-t5lN2ke_CVtt6M9PgbfRigzM';
        var myClientID = '122484679214.apps.googleusercontent.com';
        var googleBooksAPIscope = 'https://www.googleapis.com/auth/books';
        var to_read_shelf_ID = 2;         // magic number for 'To Read' shelf is 2 per https://developers.google.com/books/docs/v1/using#ids

        var oauthConfig = {
            'client_id' : myClientID,
            'scope'     : googleBooksAPIscope,
            'immediate' : true
        } // TODO: consider whether that immediate: true is needed in oauthConfig.

        gapi.client.setApiKey(myAPIkey); // only needed for non-authorized API requests
        gapi.auth.authorize({client_id : myClientID, scope : googleBooksAPIscope }, handleAuthResult);

        function handleAuthResult(authResult) {
            if (authResult && !authResult.error) {
                var myToken = gapi.auth.getToken().access_token;
                console.log("Your access token is: " + myToken);
                // now we can make authenticated API calls
                getBooksByShelfID(to_read_shelf_ID, myToken );
            } else {
                console.log("auth didn't work, so let's see about that...");
                gapi.auth.authorize({client_id : myClientID, scope : googleBooksAPIscope, immediate : false}, handleAuthResult);
//              // this prompts over and over again until you give permission; answering no just prompts again
            }
        }

        function getBooksByShelfID(shelf_id, token) {
            var ajax_url = 'https://www.googleapis.com/books/v1/mylibrary/bookshelves/'
                + shelf_id
                + '/volumes?access_token='
                + token;
            console.log('sending a request to ' + ajax_url);
            $.getJSON(ajax_url, function(json) {
                if (json.items) {
                    console.log("I got books from that shelf!");
                    console.log(json.items);
                    // why am I using traditional for (i = 0, i < end, i++) iterator instead of using .each?
                    for (var i = 0; i < json.items.length; i++) {
                        var book_title = json.items[i].volumeInfo.title;
                        var img_url = json.items[i].volumeInfo.imageLinks.thumbnail;
                        addItem (new myItem(book_title, img_url));
                    }
                }
            });
        }
    });

    // load books from Dan's hardcoded TBR Google Books shelf
    $("#load_DanTBR_from_google_books").click(function(){
        // Because this shelf is set to public, no OAuth access token is needed; can just use app's API key.
        // to get all the books from my public TBR shelf, I need to use a few things - hardcoding for now:
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

