const stripe = require('stripe')(process.env.STRIPE_KEY);

export default async (req, res) => {

    try {

        const account = await stripe.accounts.create({
            country: 'US',
            type: 'custom',
            capabilities: {
                treasury: { requested: true },
                issuing: { requested: true },
                card_issuing: { requested: true },
                card_payments: { requested: true },
                transfers: { requested: true }
            },
        });


        return res.status(200).json({ account_status: 'custom_stateset_account_created' });

    } catch (error) {
        return res.status(503).send({
            success: false,
            error: error.stack
        });
    }
};