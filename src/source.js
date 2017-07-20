const nonce = require('nonce')();
const crypto = require('crypto');
const percentEncode = require('oauth-percent-encode');
const oauthSign = require('oauth-sign');

module.exports = function() {

  const audiences = {
    offset: 0
  };

  audiences['consumerSecretKey'] = 'Ht4VhGRv9AXO9Hi6O6NAjypx2nuvUGNu7UBKBZjJRY'; // 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw'; 
  audiences['oAuthTokenSecret'] = '3VtZqIy562a1woTLZSRIzDzez9Znfudw3MBEqZezpmwkj'; // 'LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE'; 

  audiences.ta = {};
  audiences.ta['oauth_consumer_key'] =  'nWjouLLeEAXHoNtfXtXTg'; // 'xvz1evFS4wEEPTGEFPHBog';
  audiences.ta['oauth_nonce'] = nonce(); // 'kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg';
  audiences.ta['oauth_signature_method'] = 'HMAC-SHA1';
  audiences.ta['oauth_timestamp'] = Math.floor(new Date().getTime() / 1000).toString(); // '1318622958'; 
  audiences.ta['oauth_token'] = '39724345-XN4C9CMfkx4qLYRKiKI7kuL0npqmRkhZpKiQ3ysD2'; // '370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb';
  audiences.ta['oauth_version'] = '1.0';
  audiences.ta.id = '13911'
  //audiences.ta['include_entities'] = 'true';
  //audiences.ta['status'] = 'Hello Ladies + Gentlemen, a signed OAuth request!';
  audiences.httpMethod = 'GET';
  audiences.baseURL =  'https://api.twitter.com/1.1/trends/place.json?id=13911'; // 'https://api.twitter.com/1.1/statuses/update.json';
  const corsBaseURL = 'http://0.0.0.0:9090/https://api.twitter.com/1.1/trends/place.json?id=13911';

  const paramString = Object.keys(audiences.ta).sort().map((key) => {
    const encodedKey = percentEncode(key);
    const encodedValue = percentEncode(audiences.ta[key]);
    return `${encodedKey}=${encodedValue}`;
  }).join('&');

  const signed2 = oauthSign.sign(audiences.ta['oauth_signature_method'], audiences.httpMethod, audiences.baseURL, [['id'],['13911']], 'Ht4VhGRv9AXO9Hi6O6NAjypx2nuvUGNu7UBKBZjJRY', '3VtZqIy562a1woTLZSRIzDzez9Znfudw3MBEqZezpmwkj');

  console.log("paramString", paramString, paramString === 'include_entities=true&oauth_consumer_key=xvz1evFS4wEEPTGEFPHBog&oauth_nonce=kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1318622958&oauth_token=370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb&oauth_version=1.0&status=Hello%20Ladies%20%2B%20Gentlemen%2C%20a%20signed%20OAuth%20request%21');

  const signatureBaseString = `${audiences.httpMethod}&${percentEncode(audiences.baseURL)}&${percentEncode(paramString)}`;

  console.log("signatureBaseString", signatureBaseString, signatureBaseString === 'POST&https%3A%2F%2Fapi.twitter.com%2F1.1%2Fstatuses%2Fupdate.json&include_entities%3Dtrue%26oauth_consumer_key%3Dxvz1evFS4wEEPTGEFPHBog%26oauth_nonce%3DkYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1318622958%26oauth_token%3D370773112-GmHxMAgYyLbNEtIKZeRNFsMKPR9EyMZeS9weJAEb%26oauth_version%3D1.0%26status%3DHello%2520Ladies%2520%252B%2520Gentlemen%252C%2520a%2520signed%2520OAuth%2520request%2521');

  const signingString = `${percentEncode(audiences.consumerSecretKey)}&${audiences.oAuthTokenSecret}`;
  
  console.log('signingString', signingString, signingString === 'kAcSOqF21Fu85e7zjz7ZN2U4ZRhfV3WpwPAoE3Z7kBw&LswwdoUaIvS8ltyTt5jkRh4J50vUPVVHtR2YPi5kE');

  audiences.ta['oauth_signature'] = signed2; /*crypto.createHmac('sha1', signingString)
    .update(signatureBaseString)
    .digest('base64');*/

  console.log('hash', audiences.ta['oauth_signature']);

  delete audiences.ta.id;

  const fullParamString = Object.keys(audiences.ta).sort().map((key) => {
    const encodedKey = percentEncode(key);
    const encodedValue = percentEncode(audiences.ta[key]);
    return `${encodedKey}="${encodedValue}"`;
  }).join(', ');

  const authHeaderString = `OAuth ${fullParamString}`;
  console.log('authHeaderString', authHeaderString);

  const xhr = new XMLHttpRequest();
  const twitterTrendingUrl = corsBaseURL;

  xhr.open('GET', twitterTrendingUrl);

  xhr.onerror = function twitterTrendingError(err) {
    console.error(err);
  }

  xhr.onload = function twitterTrendingData() {
    if (xhr.status === 200) {
      const res = JSON.pars(xhr.responseText);
      console.log("value", res);
    } else {
      console.error(xhr.responseText);
    }
  }

  xhr.setRequestHeader('Authorization', authHeaderString);
  xhr.send();

  const baseString = `${audiences.httpMethod}&${percentEncode(audiences.baseURL)}&${percentEncode(paramString)}`;

  audiences.baseUrl = 'https://api.brandwatch-audiences.com/';

  audiences.audiencesAuth = function() {
    const xhr = new XMLHttpRequest();
    const authUrl = audiences.baseUrl + 'authentication/login';

    xhr.open('GET', authUrl);

    xhr.onerror = function httpSourceError(err) {
      console.error(err);
    };

    xhr.onload = function httpSourceSendData() {
      if ( xhr.status == 200 ) {
        const res = JSON.parse(xhr.responseText);
        console.log('value', res.login.access_token);
      } else {
        console.error(xhr.responseText);
      }
    };

    xhr.setRequestHeader('content-type', 'application/json');
    xhr.withCredentials = true;
    xhr.send({
      'username': 'mikey@brandwatch.com',
      'password': 'Ch0c0lat3cak3!u',
      'grant_type': 'password',
      'client_id': 'brandwatch-application-client'
    });
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
