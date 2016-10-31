var http = require('http');
var url = require('url');
var Feed = require('./rss');

var PORT = process.env.PORT || 80;
if(process.argv[2]){
    PORT = parseInt(process.argv[2], 10);
}


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
