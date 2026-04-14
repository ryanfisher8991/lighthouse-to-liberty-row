const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const PRICE_PER_TICKET = 5000; // $50.00 in cents

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')   { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { quantity, name, email } = req.body;

  if (!quantity || quantity < 1 || quantity > 20) {
    res.status(400).json({ error: 'Invalid quantity' }); return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:        PRICE_PER_TICKET * quantity,
      currency:      'usd',
      receipt_email: email || undefined,
      description:   `Crawfish Boil Fundraiser — ${quantity} ticket${quantity > 1 ? 's' : ''}`,
      metadata: {
        event:    'crawfish_boil',
        name:     name || '',
        email:    email || '',
        quantity: String(quantity)
      }
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('create-crawfish-payment:', err);
    res.status(500).json({ error: err.message });
  }
};
