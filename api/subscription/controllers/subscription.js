'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const { user } = ctx.state
    console.log('user>>>', ctx.state.user.id);
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.subscription.search(ctx.query);
    } else {
      console.log('ctx', ctx.query);
      entities = await strapi.services.subscription.find(user.id);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.subscription }));
  },
  async findByUser(ctx) {
    console.log(21111111);
    const { user } = ctx.state
    console.log('user>>>', ctx.state.user.id);
    let entities;
    if (user.id) {
      if (ctx.query._q) {
        entities = await strapi.services.subscription.search(ctx.query);
      } else {
        console.log('ctx', ctx.query);
        entities = await strapi.services.subscription.find({ 'user.id': user.id });
      }
    } else {
      ctx.send({
        status: false,
        message: "You Can Not Perform This Action Because This Application Does Not belong to you"
      });
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.subscription }));
  },
  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.subscription.findOne({ id });
    console.log(entity);
    return sanitizeEntity(entity, { model: strapi.models.subscription });
  },
  async update(ctx) {
    const { id } = ctx.params;

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.subscription.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.subscription.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.subscription });
  },
  async cancelSubscription(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state

    let entity, response;

    response = await strapi.services.subscription.findOne({ id });
    if (response.user.id === user.id) {
      entity = await strapi.services.subscription.update({ id }, { active: false });
    } else {
      ctx.send({
        status: false,
        message: "You Can Not Cancel Subscription Because This Application Does Not belong to you"
      });
    }

    return sanitizeEntity(entity, { model: strapi.models.subscription });
  }
};
