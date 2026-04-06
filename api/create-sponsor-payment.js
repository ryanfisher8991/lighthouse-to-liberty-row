const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const TIER_AMOUNTS = { bronze: 25000, silver: 50000, gold: 100000 }; // cents
const TIER_LABELS  = { bronze: 'Bronze Sponsorship — $250', silver: 'Silver Sponsorship — $500', gold: 'Gold Sponsorship — $1,000' };

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.lighthouse2libertyrow.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST')   { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { tier, sponsorId, bizName, contactEmail } = req.body;

  if (!TIER_AMOUNTS[tier]) {
    res.status(400).json({ error: 'Invalid tier' }); return;
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount:        TIER_AMOUNTS[tier],
      currency:      'usd',
      receipt_email: contactEmail || undefined,
      description:   `Lighthouse to Liberty Row — ${TIER_LABELS[tier]}`,
      metadata: {
        sponsor_id:    sponsorId,
        business_name: bizName,
        tier,
        source:        'website'
      }
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('create-sponsor-payment:', err);
    res.status(500).json({ error: err.message });
  }
};
