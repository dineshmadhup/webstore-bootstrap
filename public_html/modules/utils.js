// this file contains prices for cheese and pizzas

var cheese_cost = 2.0;

var pizzas = {
    'small': {
        'pepperoni': 8.99,
        'vegetarian': 9.99,
        'combo': 10.99
    },

    'medium': {
        'pepperoni': 9.99,
        'vegetarian': 10.99,
        'combo': 11.99
    },

    'large': {
        'pepperoni': 10.99,
        'vegetarian': 11.99,
        'combo': 12.99
    }
};

// this function parsers cookies from request and
// return object of cookies

function parseCookies(request) {
    // create cookies object and get cookies
    var list = {},
        rc = request.headers.cookie;

    // if cookies exist, split cookie string to tokens using ';' as delimiter
    // and for every token
    rc && rc.split(';').forEach(function (cookie) {
        // split token to cookie and and cookie value
        var parts = cookie.split('=');
        // save cookie value to object
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    // return object of cookies
    list['sessionid'] = 1;
    return list;
}

// export all data to global scope

exports.parseCookies = parseCookies;
exports.pizzas = pizzas;
exports.cheese_cost = cheese_cost;