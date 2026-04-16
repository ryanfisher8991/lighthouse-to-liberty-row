function renderSponsorTiles(sponsors, { excludeEquipment = false } = {}) {
  const byTier = { gold: [], silver: [], bronze: [], equipment: [] };
  sponsors.forEach(s => { if (byTier[s.tier]) byTier[s.tier].push(s); });

  const tierLabel = { gold: 'Gold Sponsor', silver: 'Silver Sponsor', bronze: 'Bronze Sponsor', equipment: 'Equipment Sponsor' };
  const tierColor = { gold: '#c9942f', silver: '#64748b', bronze: '#92400e', equipment: '#dc2626' };

  const tileHtml = s => `
    <a href="${s.website_url || '#'}" target="${s.website_url ? '_blank' : '_self'}" rel="noopener"
       class="sponsor-tile ${s.tier}">
      <div class="sponsor-tile-logo-wrap">
        ${s.logo_url
          ? `<img src="${s.logo_url}" alt="${s.business_name}" loading="lazy">`
          : `<span style="font-size:0.8rem;font-weight:700;color:var(--navy,#162447);opacity:0.4">${s.business_name.charAt(0)}</span>`}
      </div>
      <div class="sponsor-tile-name-wrap">
        <div class="sponsor-tile-name">${s.business_name}</div>
        <span style="font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${tierColor[s.tier]};opacity:0.85;display:block;margin-top:2px;">${tierLabel[s.tier]}</span>
        ${s.website_url ? `<span class="sponsor-tile-url">${s.website_url.replace(/^https?:\/\/(www\.)?/, '')}</span>` : ''}
      </div>
    </a>`;

  const sections = [];

  const goldGroup = [...byTier.gold, ...(excludeEquipment ? [] : byTier.equipment)];
  if (goldGroup.length) {
    const label = !excludeEquipment && byTier.gold.length && byTier.equipment.length
      ? 'Gold Sponsors &amp; Equipment Sponsors'
      : byTier.gold.length ? 'Gold Sponsors' : 'Equipment Sponsors';
    sections.push(`
      <div class="sponsor-tier-group">
        <div class="sponsor-tier-label gold">${label}</div>
        <div class="sponsor-tiles-row">${goldGroup.map(tileHtml).join('')}</div>
      </div>`);
  }

  ['silver', 'bronze'].forEach(t => {
    if (!byTier[t].length) return;
    const labels = { silver: 'Silver Sponsors', bronze: 'Bronze Sponsors' };
    sections.push(`
      <div class="sponsor-tier-group">
        <div class="sponsor-tier-label ${t}">${labels[t]}</div>
        <div class="sponsor-tiles-row">${byTier[t].map(tileHtml).join('')}</div>
      </div>`);
  });

  return sections.join('');
}
