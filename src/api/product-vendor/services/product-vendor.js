'use strict';

/**
 * product-vendor service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::product-vendor.product-vendor');
