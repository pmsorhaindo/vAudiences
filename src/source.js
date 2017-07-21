const http = require('http');
const OAuth = require('oauth-1.0a');
const request = require('request');
const crypto = require('crypto');
const express = require('express');
const twitterProxyMiddleware = require('./twitterProxyMiddleware');

module.exports = function() {

  const app = express();

  app.get('/home', (req, res) => res.redirect('/'));
  app.use('/twitter', twitterProxyMiddleware);
  
  const audiences = {
    offset: 0
  };

  const oauth = OAuth({
    consumer: {
      key: 'Ix0Out5G4kM6WS9945HoILZeh',
      secret: 'QtkqegUaKfbicCijbirLCudUKlQPGg3Xg949zAUu0s2uHZdYna'
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
      return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
  });
  
  const request_data = {
    url: 'https://api.twitter.com/1.1/trends/place.json?id=1',
    method: 'GET',
    data: {
      id: '1',
    },
  };

  const token = {
    key: '39724345-e3zwlySYfa3hj8loixfefLfCAUVQBgnMT7sUZfMuE',
    secret: '3ftlDQwqpNObutHuecv292UgqPjKHolth4Ua7VxduUBoL',
  };
  
  http.createServer(function (req, resp) {
    if (req.url === '/doodle.png') {
      request.get('http://google.com').pipe(resp)
    }
  }).listen(8081);

  request({
    url: request_data.url,
    method: request_data.method,
    form: request_data.data,
    headers: oauth.toHeader(oauth.authorize(request_data, token))
  }, function(error, response, body) {
    //process your data here 
    console.log("value", body, error);
  });

  audiences.source = function(v4d) {
    const config = v4d.config,
      objPath = config.objPath || 'data';

    this.pageSize = config.pageSize || 10;
    this.key = config.key;

    this.query = config.scene ?
      (config.scene.options.searchQuery.length ?
        config.scene.options.searchQuery.replace(' ', '+') :
        config.scene.name.replace(' ', '+')) :
      config.query;

    const xhr = new XMLHttpRequest();
    const giphyUrl = audiences.makeUrl();
    xhr.open("GET", giphyUrl);

    xhr.onerror = function httpSourceError(err) {
      v4d.error(err);
    };

    xhr.onload = function httpSourceSendData() {
      if ( xhr.status == 200 ) {
        const res = JSON.parse(xhr.responseText);
        audiences.offset += audiences.pageSize;

        v4d.push(objPath ? res[objPath] : res);
      } else {
        v4d.error(xhr.responseText);
      }
    };

    xhr.send(null);
  }

  audiences.searchAuthors = function() {
    const xhr = new XMLHttpRequest();
    const searchUrl = "https://api.brandwatch-audiences.com/audiences/preview?start=0&count=10";
    xhr.open("POST", authUrl);

    var data = JSON.stringify({
      "query": {
        "operator": "AND",
        "children": [
          {
            "operator": "AND",
            "children": [
              {
                "field": "BIO",
                "operator": "OR",
                "value": [
                  "Brandwatch"
                ]
              }
            ]
          }
        ]
      }
    });

    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        console.log(this.responseText);
      }
    });

    xhr.open("POST", searchUrl);
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("authorization", "f978d4ba-5f20-4369-9e72-f204dbe963bd");
    xhr.setRequestHeader("userid", "168685082");
    xhr.setRequestHeader("cache-control", "no-cache");

    xhr.send(data);
  };

  audiences.makeUrl = function() {
    return "https://api.giphy.com/v1/gifs/" +
      (this.query.length ? "search" : "trending") +
      "?q=" + this.query + "&api_key=" + this.key +
      "&limit=" + this.pageSize + "&offset=" + this.offset;
  };

  return audiences;
};
