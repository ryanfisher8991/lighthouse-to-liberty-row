// Supabase project credentials — fill in from:
// Supabase Dashboard → Project Settings → API
const SUPABASE_URL = 'https://ldvqxumswhvxzmbclboy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkdnF4dW1zd2h2eHptYmNsYm95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwOTk2ODUsImV4cCI6MjA5MDY3NTY4NX0.KXEIatQQsuquC7vBbXOLFNRfWKVcMl516LotariXq4I';

if (!window.supabase) {
  console.error('Supabase CDN failed to load.');
}
const db = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const DONATION_SOURCE = { STRIPE: 'stripe', VENMO: 'venmo', CASH: 'cash' };
const USER_ROLE = { ADMIN: 'admin', MEMBER: 'member' };
const DONOR_LIST_LIMIT = 50;
const SPONSOR_LIST_LIMIT = 100;

async function getSettings() {
  if (!db) return {};
  const { data, error } = await db.from('settings').select('key, value');
  if (error) { console.error('getSettings:', error); return {}; }
  return Object.fromEntries(data.map(r => [r.key, r.value]));
}

async function getFundraiseSummary() {
  if (!db) return { total_raised: 0, goal: 10000, donation_count: 0 };
  const { data, error } = await db.from('fundraise_summary').select('*').single();
  if (error) { console.error('getFundraiseSummary:', error); }
  return data || { total_raised: 0, goal: 10000, donation_count: 0 };
}

async function getPublicDonations() {
  if (!db) return [];
  const { data, error } = await db
    .from('donations')
    .select('id, amount, donor_name, is_anonymous, created_at')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(DONOR_LIST_LIMIT);
  if (error) { console.error('getPublicDonations:', error); return []; }
  return data;
}

async function getApprovedSponsors() {
  if (!db) return [];
  const { data, error } = await db
    .from('sponsors')
    .select('id, business_name, website_url, logo_url, tier')
    .eq('approved', true)
    .eq('payment_status', 'paid')
    .order('tier', { ascending: false })
    .limit(SPONSOR_LIST_LIMIT);
  if (error) { console.error('getApprovedSponsors:', error); return []; }
  return data;
}

function formatCurrency(amount) {
  return '$' + Number(amount).toLocaleString('en-US', { maximumFractionDigits: 0 });
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isAdmin(user) {
  return user?.user_metadata?.role === USER_ROLE.ADMIN;
}

function renderSponsorTiles(sponsors) {
  const byTier = { gold: [], silver: [], bronze: [] };
  sponsors.forEach(s => { if (byTier[s.tier]) byTier[s.tier].push(s); });

  const tierConfig = {
    gold:   { label: 'Gold Sponsors' },
    silver: { label: 'Silver Sponsors' },
    bronze: { label: 'Bronze Sponsors' },
  };

  return ['gold', 'silver', 'bronze']
    .filter(t => byTier[t].length)
    .map(t => `
      <div class="sponsor-tier-group">
        <div class="sponsor-tier-label ${t}">${tierConfig[t].label}</div>
        <div class="sponsor-tiles-row">
          ${byTier[t].map(s => `
            <a href="${s.website_url || '#'}" target="${s.website_url ? '_blank' : '_self'}" rel="noopener" class="sponsor-tile ${t}">
              <div class="sponsor-tile-logo-wrap">
                ${s.logo_url
                  ? `<img src="${s.logo_url}" alt="${s.business_name}" loading="lazy">`
                  : `<span style="font-size:0.8rem;font-weight:700;color:var(--navy);opacity:0.4">${s.business_name.charAt(0)}</span>`}
              </div>
              <div class="sponsor-tile-name-wrap">
                <div class="sponsor-tile-name">${s.business_name}</div>
                ${s.website_url ? `<span class="sponsor-tile-url">${s.website_url.replace(/^https?:\/\/(www\.)?/, '')}</span>` : ''}
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');
}
