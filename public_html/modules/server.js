// include required modules

var http = require("http");
var url = require("url");
var fs = require('fs');
var utils = require(__dirname + "/utils");
var querystring = require("querystring");


// this function start a new HTTP server
function start(route, handle) {
    // function onRequest will handle all the requests to server
    function onRequest(request, response) {
        var postData = "";

        // if request url ends with .css
        if (request.url.indexOf('.css') != -1) {
            // then send styles.css file to user
            fs.readFile(
                __dirname + '/../view/styles.css',
                function (error, data) {
                    if (error) throw error;
                    response.writeHead(200, {'Content-Type': 'text/css'});
                    response.write(data);
                    response.end();
                }
            );
        }

        // if request url ends with .js
        if (request.url.indexOf('.js') != -1) {
            // then send javascript file to user
            fs.readFile(
                __dirname + '/../view/scripts.js',
                function (error, data) {
                    if (error) throw error;
                    response.writeHead(200, {'Content-Type': 'text/javascript'});
                    response.write(data);
                    response.end();
                }
            );
        }

        // get pathname part from request url
        var pathname = url.parse(request.url).pathname;

        // if request is an image file
        if (pathname.indexOf('.jpg') != -1 || pathname.indexOf('.png') != -1 || pathname.indexOf('.gif') != -1) {
            // send it to user
            fs.readFile(
                __dirname + '/../view' + pathname,
                function (error, data) {
                    if (error) throw error;
                    response.writeHead(200, {'Content-Type': 'text/image'});
                    response.write(data);
                    response.end();
                }
            );
        }

        // if we handle a POST request
        if (request.method == 'POST') {

            // assign event listener to get POST data
            request.addListener("data", function (chunk) {
                postData += chunk;
            });

            // assign event listener to process received POST data
            request.addListener("end", function () {
                // get POST data as query string
                var data = querystring.parse(postData);
                // get cookies of the current user
                var cookies = utils.parseCookies(request);

                // save session id to POST data
                data['sid'] = cookies['sessionid'];

                // invoke request handler for request path
                route(handle, pathname, response, request, data);
            });
        } else {
            // all other request are GET requests, so process them with
            // no additional tasks
            route(handle, pathname, response, request, null);
        }
    }

    // create http server
    http.createServer(onRequest).listen(8888, "0.0.0.0");
}

// export start function

exports.start = start;