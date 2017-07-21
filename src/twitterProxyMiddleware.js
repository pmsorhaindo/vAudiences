const request = require('request');

module.exports = (req, res) => req.pipe(request({
  url: 'https://api.twitter.com/1.1/trends/place.json?id=1',
})).pipe(res);
