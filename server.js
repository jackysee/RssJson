var http = require('http');
var url = require('url');
var Feed = require('./rss');

var PORT = process.env.PORT || 8888;

function getFeedUrl(request){
    return url.parse(request.url, true).query.url;
}

function writeError(err, response){
    response.writeHead(500, {
        "Content-Type":"text/plain;charset=utf-8",
        "Access-Control-Allow-Origin":"*"
    });
    response.write(err + "\n");
    response.end();
}

function writeJsonResponse(rss, response){
    response.writeHead(200, {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin":"*"
    });
    response.write(JSON.stringify(rss));
    response.end();
}

function handleRequest(request, response){
    var feedUrl = getFeedUrl(request);
    var isHttps = /^https:/.test(feedUrl);
    if(isHttps){
        feedUrl = feedUrl.replace(/^https/, "http");
        console.log('try connect to non-https:', feedUrl);
    }
    console.log('try connect to:', feedUrl);
    Feed.load(feedUrl, function(err, rss){
        if(err){
            console.log('error', err);
            writeError(err, response);
        }
        else{
            writeJsonResponse(rss, response);
        }
    });
}


var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Sever started on %s", PORT);
});
