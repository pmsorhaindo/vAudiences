const bundle = require( "./src/bundle" );

bundle.load({
  destTarget: "body"
});

bundle.start();
