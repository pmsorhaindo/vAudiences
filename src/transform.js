module.exports = {
  transform: function(data, v4d) {
    [].concat(data).forEach(function(d) {
      const trending = Date.parse(d.trending_datetime);
      if (!isNaN(trending)) {
        v4d.push(d);
      }
    });
    v4d.done();
  }
};
