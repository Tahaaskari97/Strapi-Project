'use strict';
const { error } = require('npmlog');
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { user } = ctx.state
    console.log('user>>>', user.id);
    let entity;

    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.application.create({ ...data, user: user.id }, { files });
    } else {
      entity = await strapi.services.application.create({ ...ctx.request.body, user: user.id });
    }
    await strapi.services.subscription.create({ plan: 1, active: true, application: entity.id, user: user.id });

    console.log(entity.id);
    return sanitizeEntity(entity, { model: strapi.models.application });
  },
  async findByUser(ctx) {
    console.log(21111111);
    const { user } = ctx.state
    console.log('user>>>', ctx.state.user.id);
    let entities;
    if (user.id) {
      entities = await strapi.services.application.find({ 'user.id': user.id });
    } else {
      ctx.send({
        status: false,
        message: "You Can Not Perform This Action Because This Application Does Not belong to you"
      });
    }
    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.application }));
  },
  async findOneByUser(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state
    console.log('user>>>', ctx.state.user.id);
    if (user.id) {
      console.log(1);
      const entity = await strapi.services.application.findOne({ id: id, 'user.id': user.id });
      console.log(entity);
      if (entity) {
        return sanitizeEntity(entity, { model: strapi.models.application });
      } else {
        ctx.send({
          status: false,
          message: "You Can Not Perform This Action Because This Application Does Not belong to you"
        });
      }
    } else {
      ctx.send({
        status: false,
        message: "User Not Found"
      });
    }
  },
  async update(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state
    console.log('user>>>>>11>', user.id);

    let entity, response;

    response = await strapi.services.application.findOne({ id });

    console.log('response.user.id', response.user.id);
    if (response.user.id === user.id) {
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        entity = await strapi.services.application.update({ id }, data, {
          files,
        });
      } else {
        entity = await strapi.services.application.update({ id }, ctx.request.body);
      }
    } else {
      ctx.send({
        status: false,
        message: "This Application Does Not belong to you"
      });
    }

    return sanitizeEntity(response, { model: strapi.models.application });
  },
  async delete(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state
    console.log('user>>>>>11>', user.id);

    let entity, response;

    response = await strapi.services.application.findOne({ id });
    if (response.user.id === user.id) {
      entity = await strapi.services.application.delete({ id });
    } else {
      ctx.send({
        status: false,
        message: "This Application Does Not belong to you"
      });
    }
    return sanitizeEntity(entity, { model: strapi.models.application });
  },
  async getSubscriptionByApplication(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.subscription.findOne({ "application.id": id });
    if (entity) {
      return sanitizeEntity(entity, { model: strapi.models.subscription });
    } else {
      ctx.send({
        status: false,
        message: "Application Not Found"
      });
    }
  },
  async updateSubscriptionByApplication(ctx) {
    const { id } = ctx.params;
    const { user } = ctx.state
    console.log('user>>>>>11>', user.id);

    let entity, response;

    response = await strapi.services.subscription.findOne({ "application.id": id });

    console.log('response.user.id', response.application.id);
    if (response.user.id === user.id) {
      if (ctx.is('multipart')) {
        const { data, files } = parseMultipartData(ctx);
        entity = await strapi.services.application.update({ "application": id }, { ...data, application: id, user: user.id }, {
          files,
        });
      } else {
        entity = await strapi.services.subscription.update({ "application": id }, { ...ctx.request.body, application: id, user: user.id });
      }
    } else {
      ctx.send({
        status: false,
        message: "Application Not Found"
      });
    }

    return sanitizeEntity(entity, { model: strapi.models.application });
  },
};
