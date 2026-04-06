const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.lighthouse2libertyrow.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')   { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { amount, name, email, isAnon } = req.body;

  if (!amount || isNaN(amount) || amount < 1) {
    res.status(400).json({ error: 'Invalid amount' }); return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:        Math.round(amount * 100), // cents
      currency:      'usd',
      receipt_email: email || undefined,
      description:   'Lighthouse to Liberty Row — Donation',
      metadata: {
        donor_name:   name     || 'Anonymous',
        is_anonymous: isAnon   ? 'true' : 'false',
        source:       'website'
      }
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('create-payment-intent:', err);
    res.status(500).json({ error: err.message });
  }
};
