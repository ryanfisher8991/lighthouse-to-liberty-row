(async () => {
  const el = document.getElementById('landingSponsorsDisplay');
  if (!el) return;
  try {
    const sponsors = await getApprovedSponsors();
    el.innerHTML = sponsors.length
      ? renderSponsorTiles(sponsors)
      : '<p class="sponsor-tiles-empty">No sponsors yet — <a href="/sponsors" style="color:var(--gold)">be the first!</a></p>';
  } catch (e) {
    console.error('sponsor tiles:', e);
    el.innerHTML = '<p class="sponsor-tiles-empty">No sponsors yet — <a href="/sponsors" style="color:var(--gold)">be the first!</a></p>';
  }
})();
