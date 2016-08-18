// this function decides what handler should be invoked

function route(handle, pathname, response, request, postData) {
    // if handler exists for requested path
    if (typeof handle[pathname] === 'function') {
        // invoke it with all parameters
        handle[pathname](response, request, postData);
        // if other case
    } else if (pathname.indexOf('.') == -1) {
        // send 404 error
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not Found");
        response.end();
    }
}

// export route to global scope

exports.route = route;