const Bundle = require( "@vizia/v4d" );
const gifs = require( "./source" );
const trending = require( "./transform" );
const carousel = require( "./destination" );
const array = require( "@vizia/v4d/toolkit/sources/array" );
const log = require( "@vizia/v4d/toolkit/destinations/log" );

const bundle = new Bundle("pull");

const rocks = [
  { name: "sedimentary" },
  { name: "metamorphic" },
  { name: "igneous" }
];

bundle.set("key", "dc6zaTOxFJmzC")
  .set("query", "kanye")
  .setThrottle(2000)

  .use(gifs())
  .use(trending)
  .use({transform: function(data, v4d) {
    [].concat(data).forEach(function(d) {
      v4d.push({
        url: d.images.original.url,
        label: (d.source_tld || d.source_post_url)
      });
    });
    v4d.done();
  }})
  .use(carousel());

/*
bundle.use( array( rocks ) );
bundle.use({ transform: function( rock, v4d ) {
  v4d.push( rock.name );
  v4d.done();
}});

bundle.use( log );
*/

module.exports = bundle;

