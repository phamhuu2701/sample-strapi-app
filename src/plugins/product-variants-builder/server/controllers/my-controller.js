'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('product-variants-builder')
      .service('myService')
      .getWelcomeMessage();
  },
});
