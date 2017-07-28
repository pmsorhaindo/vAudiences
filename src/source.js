const OAuth = require('oauth-1.0a');
const request = require('request');
const crypto = require('crypto');
const twitterAPI = require('node-twitter-api');

module.exports = function() {

  let reqToken;
  let reqTokenSecret;
  const twitter = new twitterAPI({
    consumerKey: 'Ix0Out5G4kM6WS9945HoILZeh',
    consumerSecret: 'QtkqegUaKfbicCijbirLCudUKlQPGg3Xg949zAUu0s2uHZdYna',
    callback: 'http://yoururl.tld/something'
  });

  twitter.getRequestToken(function(error, requestToken, requestTokenSecret, results){
    if (error) {
      console.log("Error getting OAuth request token : " + error);
    } else {
      //store token and tokenSecret somewhere, you'll need them later; redirect user 
      reqToken = requestToken
      reqTokenSecret = requestTokenSecret
      console.log("value", reqToken, reqTokenSecret);
    }
  });

  const audiences = {
    offset: 0
  };

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
