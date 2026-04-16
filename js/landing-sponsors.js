(async () => {
  const el = document.getElementById('landingSponsorsDisplay');
  if (!el) return;

  try {
    const { data: sponsors, error } = await db
      .from('sponsors')
      .select('id, business_name, website_url, logo_url, tier')
      .eq('approved', true)
      .or('payment_status.eq.paid,tier.eq.equipment')
      .order('tier', { ascending: false })
      .limit(100);

    if (error || !sponsors || !sponsors.length) {
      el.innerHTML = '<p class="sponsor-tiles-empty">No sponsors yet — <a href="/sponsors" style="color:var(--gold)">be the first!</a></p>';
      return;
    }

    el.innerHTML = renderSponsorTiles(sponsors);
  } catch (e) {
    console.error('sponsor tiles:', e);
    el.innerHTML = '<p class="sponsor-tiles-empty">No sponsors yet — <a href="/sponsors" style="color:var(--gold)">be the first!</a></p>';
  }
})();
