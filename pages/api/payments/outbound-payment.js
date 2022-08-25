const stripe = require('stripe')(process.env.STRIPE_KEY);

export default async (req, res) => {

  const description = req.body.description;
  const account = req.body.treasury_account.token;
  const amount = req.body.amount;
  const currency = 'usd';
  const account_holder_name = req.body.account_holder_name;
  const routing_number = req.body.routing_number;
  const account_number = req.body.account_number;
  const account_holder_type = req.body.account_holder_type;
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const line_1 = req.body.line_1;
  const city = req.body.city;
  const state = req.body.state;
  const postal_code = req.body.postal_code;
  const country = req.body.country;
  const financial_account_id = req.body.financial_account_id;
  const stripe_account = req.body.stripe_account_id;

  try {

    const outboundPayment = await stripe.treasury.outboundPayments.create(
      {
        destination_payment_method_data: {
          type: 'us_bank_account',
          account_holder_type: account_holder_type,
          us_bank_account: {
            account_holder_name: account_holder_name,
            routing_number: routing_number,
            account_number: account_number,
          },
          billing_details: { 
            name: first_name + ' ' + last_name,
            address: {
              line1: line_1,
              city: city,
              state: state,
              postal_code: postal_code,
              country: country
            },
          },
        },
        destination_payment_method_options : {
          us_bank_account: {
            network: 'us_domestic_wire'
          }
        },
        statement_descriptor: description,
        financial_account: financial_account_id,
        amount: amount,
        currency: currency,
      },
      { stripeAccount: stripe_account }
    );

    console.log(outboundPayment)

    return res.status(200).json({ status: "payment_sent" });

  } catch (error) {
    return res.status(503).send({
      success: false,
      error: error.stack
    });
  }
};
