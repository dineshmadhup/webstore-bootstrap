// include modules
var fs = require('fs');
var url = require('url');
var mydb = require(__dirname + '/mydb');
var utils = require(__dirname + "/utils");

// Connect to DB first
mydb.connectDB();

// this function handles requests to main page
function index(response, request) {
    // read file index.html
    fs.readFile(
        __dirname + '/../view/index.html',
        function (error, htmlData) {
            // if error occurs during reading
            if (error) throw error; // show it
            // send html to user
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(htmlData);
            response.end();
        }
    );
}

// this function handles requests to checkout page
function checkout(response, request) {
    // read file checkout.html
    fs.readFile(
        __dirname + '/../view/checkout.html',
        function (error, htmlData) {
            // if error occurs during reading
            if (error) throw error; // show it
            // read file with shopping cart

            // send html to user
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(htmlData);
            response.end();
        }
    );
}

// this function handles POST request (adds pizzas to cart)

function addToCart(response, request, postData) {
    // read file with shopping cart
    // get cookies of the current user
    var cookies = utils.parseCookies(request);

    // create new cart entry from user's data
    var pizzaOrder = {
        'sid': cookies['sessionid'],
        'size': postData['size'],
        'kind': postData['kind'],
        'quantity': parseInt(postData['quantity']),
        'extra_cheese': eval(postData['extra_cheese'])
    };

    mydb.orderExists(pizzaOrder, function (orderExists) {
        if (orderExists) {
            mydb.updatePizzaOrder(pizzaOrder, function (affectedRows) {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write(JSON.stringify({success: affectedRows > 0}));
                response.end();
            });
        } else {
            mydb.addPizzaOrder(pizzaOrder, function (affectedRows) {
                response.writeHead(200, {'Content-Type': 'application/json'});
                response.write(JSON.stringify({success: affectedRows > 0}));
                response.end();
            });
        }
    });
}

// this function handles requests to confirmation page

function confirmation(response, request) {
    // open file confirmation.html
    fs.readFile(
        __dirname + '/../view/confirmation.html',
        function (error, htmlData) {
            if (error) throw error;

            // get cookies of the current user
            var cookies = utils.parseCookies(request);

            var sid = cookies['sessionid'];

            mydb.emptyCart(sid, function () {
                // and send it's content to user
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(htmlData);
                response.end();
            });
        }
    );
}

function order(response, request) {
    // read file order.html
    fs.readFile(
        __dirname + '/../view/order.html',
        function (error, htmlData) {
            // if error occurs during reading
            if (error) throw error; // show it
            // send html to user
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(htmlData);
            response.end();
        }
    );
}


function about(response, request) {
    // read file about.html
    fs.readFile(
        __dirname + '/../view/about.html',
        function (error, htmlData) {
            // if error occurs during reading
            if (error) throw error; // show it

            // send html to user
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(htmlData);
            response.end();
        }
    );
}

function remove(response, request) {

    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var extra_cheese = undefined;

    // get cookies of the current user
    var cookies = utils.parseCookies(request);


    var parts = query.pizza.split('_');

    if (parts.length > 2) {
        extra_cheese = true;
    }

    var order = {
        'sid': cookies['sessionid'],
        'size': parts[0],
        'kind': parts[1],
        'extra_cheese': extra_cheese
    };

    mydb.removeOrderEntry(order, function () {
        response.writeHead(301, {'Location': '/checkout'});
        response.end();
    });
}

function getNumberOfOrderedPizzas(response, request, data) {
    // get cookies of the current user
    var cookies = utils.parseCookies(request);
    // get session id from cookies
    var sid = cookies['sessionid'];

    mydb.getNumberOfOrderedPizzas(sid, function (number) {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify({number: number || 0}));
        response.end();
    });
}

function getMyCart(response, request) {
    // get cookies of the current user
    var cookies = utils.parseCookies(request);
    // get session id from cookies
    var sid = cookies['sessionid'];

    mydb.getMyCart(sid, function (cart) {
        response.writeHead(200, {'Content-Type': 'application/json'});
        response.write(JSON.stringify(cart));
        response.end();
    });
}

// export all functions

exports.getNumberOfOrderedPizzas = getNumberOfOrderedPizzas;
exports.getMyCart = getMyCart;
exports.remove = remove;
exports.index = index;
exports.order = order;
exports.about = about;
exports.checkout = checkout;
exports.addToCart = addToCart;
exports.confirmation = confirmation;