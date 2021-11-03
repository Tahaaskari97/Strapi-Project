'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async find(ctx) {
    const { user } = ctx.state
    console.log('user>>>',ctx);
    console.log('ctx', ctx);
    let entities;
    if (ctx.query._q) {
      entities = await strapi.services.plan.search(ctx.query);
    } else {
      entities = await strapi.services.plan.find(ctx.query);
    }

    return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.plan }));
  },
  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.plan.create(data, { files });
    } else {
      entity = await strapi.services.plan.create(ctx.request.body);
    }
    return sanitizeEntity(entity, { model: strapi.models.plan });
  },

  async delete(ctx) {
    const { id } = ctx.params;
    console.log('ctx', ctx);
    console.log('id', id);

    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.plan.update({ id }, data, {
        files,
      });
    } else {
      entity = await strapi.services.plan.update({ id }, ctx.request.body);
    }

    return sanitizeEntity(entity, { model: strapi.models.plan });
  },
};


// 'use strict';
// const { sanitizeEntity } = require('strapi-utils');

// // const stripe = require('stripe')(process.env.STRIPE_PK)

// /**
//  * Given a dollar amount number, convert it to it's value in cents
//  * @param number 
//  */
// // const fromDecimalToInt = (number) => parseInt(number * 100)


// /**
//  * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
//  * to customize this controller
//  */

// module.exports = {
//     /**
//      * Only send back planss from you
//      * @param {*} ctx 
//      */
//     async find(ctx) {
//         const { user } = ctx.state
//         console.log(user);
//         let entities;
//         if (ctx.query._q) {
//             entities = await strapi.services.plans.search({...ctx.query, user: user.id});
//         } else {
//             entities = await strapi.services.plans.find({...ctx.query, user: user.id});
//         }

//         return entities.map(entity => sanitizeEntity(entity, { model: strapi.models.plans }));
//     },
//     /**
//      * Retrieve an plans by id, only if it belongs to the user
//      */
//     async findOne(ctx) {
//         const { id } = ctx.params;
//         const { user } = ctx.state
//         console.log(user);

//         const entity = await strapi.services.plans.findOne({ id, user: user.id });
//         return sanitizeEntity(entity, { model: strapi.models.plans });
//     },


//     async create(ctx) {
//         const BASE_URL = ctx.request.headers.origin || 'http://localhost:3000' //So we can redirect back

//         const { product } = ctx.request.body
//         if(!product){
//             return res.status(400).send({error: "Please add a product to body"})
//         }

//         //Retrieve the real product here
//         const realProduct = await strapi.services.product.findOne({ id: product.id })
//         if(!realProduct){
//             return res.status(404).send({error: "This product doesn't exist"})
//         }

//         const {user} = ctx.state //From Magic Plugin

//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "usd",
//                         product_data: {
//                             name: realProduct.name
//                         },
//                         unit_amount: fromDecimalToInt(realProduct.price),
//                     },
//                     quantity: 1,
//                 },
//             ],
//             customer_email: user.email, //Automatically added by Magic Link
//             mode: "payment",
//             success_url: `${BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: BASE_URL,
//         })

//         //TODO Create Temp plans here
//         const newplans = await strapi.services.plans.create({
//             user: user.id,
//             product: realProduct.id,
//             total: realProduct.price,
//             status: 'unpaid',
//             checkout_session: session.id
//         })

//         return { id: session.id }
//     },
//     async confirm(ctx) {
//         const { checkout_session } = ctx.request.body
//         console.log("checkout_session", checkout_session)
//         const session = await stripe.checkout.sessions.retrieve(
//             checkout_session
//         )
//         console.log("verify session", session)

//         if(session.payment_status === "paid"){
//             //Update plans
//             const newplans = await strapi.services.plans.update({
//                 checkout_session
//             },
//             {
//                 status: 'paid'
//             })

//             return newplans

//         } else {
//             ctx.throw(400, "It seems like the plans wasn't verified, please contact support")
//         }
//     }
// };
