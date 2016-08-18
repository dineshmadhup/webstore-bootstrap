// include all modules

var server = require("./modules/server");
var router = require("./modules/router");
var handlers = require("./modules/handlers");

// set available request paths and their handlers
var handle = {
    '/': handlers.index,
    '/order': handlers.order,
    '/add': handlers.addToCart,
    '/checkout': handlers.checkout,
    '/about': handlers.about,
    '/remove': handlers.remove,
    '/confirmation': handlers.confirmation,
    '/getNumberOfOrderedPizzas': handlers.getNumberOfOrderedPizzas,
    '/getMyCart': handlers.getMyCart
};


// start server
server.start(router.route, handle);