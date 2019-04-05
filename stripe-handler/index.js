var stripe = require('stripe')(process.env.MYKEY);
// ^ this is a stripe testing key

module.exports = function(context, req) {
  context.log('starting to get down');

  //if we have a request body, an email, and a token, let's get started
  if (
    req.body &&
    req.body.stripeEmail &&
    req.body.stripeToken &&
    req.body.stripeAmt &&
    req.body.metadata 
  ) {
    stripe.customers
      .create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        metadata: req.body.metadata,
        shipping: {
          name: req.body.stripeShippingName,
          address: {
            line1: req.body.stripeShippingAddressLine1,
            city: req.body.stripeShippingAddressCity,
            state: req.body.shippingAddressstate,
            country: req.body.stripeShippingAddressCountry,
            postal_code: req.body.stripeShippingAddressZip
          }
        },
      })
      .then(customer => {
        context.log('starting the stripe charges');
        stripe.charges.create({
          amount: req.body.stripeAmt,
          description: 'Sample Charge',
          currency: 'usd',
          customer: customer.id
        });
      })
      .then(charge => {
        context.log('finished the stripe charges');
        context.res = {
          // status: 200
          body: 'This has been completed'
        };
        context.done();
      })
      .catch(err => {
        context.log(err);
        context.done();
      });
  } else {
    context.log(req.body);
    context.res = {
      status: 400,
      body: "We're missing something"
    };
    context.done();
  }
};
