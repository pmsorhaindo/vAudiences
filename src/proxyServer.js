var express = require('express');  
var request = require('request');

var app = express();  

app.use('/', function(req, res) {  
    var url = apiServerHost + req.url;
    req.pipe(request(url)).pipe(res);
});

app.use('/proxy', function(req, res) {  
    var url = req.url.replace('/?url=','');
    req.pipe(request(url)).pipe(res);
});

app.listen(process.env.PORT || 3000);  

//TODO use this with an old commit with CORS errors.
