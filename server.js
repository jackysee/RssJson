var http = require('http');
var url = require('url');
var Feed = require('./rss');

const PORT=8888

function getFeedUrl(request){
    return url.parse(request.url, true).query.url;
}

function handleRequest(request, response){
    var feedUrl = getFeedUrl(request);
    console.log('try getting feed ' + feedUrl);
    Feed.load(feedUrl, function(err, rss){
        if(err){
            console.log('error', err);
            response.writeHead(500, {"Content-Type":"text/plain"});
            response.write(err + "\n");
            response.end();
            return;
        }
        else{
            response.writeHead(200, {"Content-Type": "Application/json"});
            response.write(JSON.stringify(rss));
            response.end();
            return;
        }
    });
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Sever started on %s", PORT);
});
