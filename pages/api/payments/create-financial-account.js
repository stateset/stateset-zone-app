const stripe = require('stripe')(process.env.STRIPE_KEY);


export default ((req, res) => {

    const connected_account_id = req.body.connected_account_id;

        let createFinancialAccount = async () => {

            const financialAccount = await stripe.treasury.financialAccounts.create(
                {
                    supported_currencies: ['usd'],
                    features: {
                        card_issuing: { requested: true },
                        deposit_insurance: { requested: true },
                        financial_addresses: { aba: { requested: true } },
                        inbound_transfers: { ach: { requested: true } },
                        intra_stripe_flows: { requested: true },
                        outbound_payments: {
                            ach: { requested: true },
                            us_domestic_wire: { requested: true },
                        },
                        outbound_transfers: {
                            ach: { requested: true },
                            us_domestic_wire: { requested: true },
                        },
                    },
                },
                { stripeAccount: connected_account_id }
            );
        };

        createFinancialAccount();

});