require("./carousel.css");
const template = require("./templates/carousel.hbs");

module.exports = function() {

  const renderer = {
    items: [],
    newest: false,
    limit: 10,
    delay: 2000
  };

  const wrapper = document.createElement("div");
  wrapper.className = "carousel-destination";
  wrapper.innerHTML = "<div class='carousel-wrapper'>" +
    "  <figure class='spinner'>" +
    "  </figure>" +
    "</div>";
  renderer.el = wrapper;

  renderer.destination = function(data, v4d) {
    const el = document.querySelector(v4d.config.destTarget);
    if (!el.contains(renderer.el)) {
      el.appendChild(renderer.el);
    }

    renderer.addItems(data);
    renderer.render();

    setTimeout(function() {
      v4d.done();
    }, renderer.delay);

  };

  renderer.render = function render() {
    let html = template(this);
    this.el.querySelector("figure.spinner").innerHTML = html;
  };

  renderer.addItems = function addItems(items) {
    this.items = this.items.concat(items);

    if (this.limit) {
      while (this.items.length > this.limit) {
        this.items.shift();
      }
    }
  };

  return renderer;

};
