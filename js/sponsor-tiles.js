function renderSponsorTiles(sponsors, { excludeEquipment = false } = {}) {
  const byTier = { gold: [], silver: [], bronze: [], equipment: [] };
  sponsors.forEach(s => { if (byTier[s.tier]) byTier[s.tier].push(s); });

  // Gold and equipment appear together in the top group
  const goldGroup = [...byTier.gold, ...byTier.equipment];

  const tileHtml = s => `
    <a href="${s.website_url || '#'}" target="${s.website_url ? '_blank' : '_self'}" rel="noopener"
       class="sponsor-tile ${s.tier === 'equipment' ? 'equipment' : 'gold'}">
      <div class="sponsor-tile-logo-wrap">
        ${s.logo_url
          ? `<img src="${s.logo_url}" alt="${s.business_name}" loading="lazy">`
          : `<span style="font-size:0.8rem;font-weight:700;color:var(--navy,#162447);opacity:0.4">${s.business_name.charAt(0)}</span>`}
      </div>
      <div class="sponsor-tile-name-wrap">
        <div class="sponsor-tile-name">${s.business_name}</div>
        ${s.tier === 'equipment'
          ? `<span class="sponsor-tile-equipment-label">Equipment Partner</span>`
          : (s.website_url ? `<span class="sponsor-tile-url">${s.website_url.replace(/^https?:\/\/(www\.)?/, '')}</span>` : '')}
      </div>
    </a>`;

  const sections = [];

  if (!excludeEquipment && goldGroup.length) {
    const label = byTier.gold.length && byTier.equipment.length
      ? 'Gold Sponsors &amp; Equipment Partners'
      : byTier.gold.length ? 'Gold Sponsors' : 'Equipment Partners';
    sections.push(`
      <div class="sponsor-tier-group">
        <div class="sponsor-tier-label gold">${label}</div>
        <div class="sponsor-tiles-row">${goldGroup.map(tileHtml).join('')}</div>
      </div>`);
  } else if (excludeEquipment && byTier.gold.length) {
    sections.push(`
      <div class="sponsor-tier-group">
        <div class="sponsor-tier-label gold">Gold Sponsors</div>
        <div class="sponsor-tiles-row">${byTier.gold.map(tileHtml).join('')}</div>
      </div>`);
  }

  ['silver', 'bronze'].forEach(t => {
    if (!byTier[t].length) return;
    const labels = { silver: 'Silver Sponsors', bronze: 'Bronze Sponsors' };
    sections.push(`
      <div class="sponsor-tier-group">
        <div class="sponsor-tier-label ${t}">${labels[t]}</div>
        <div class="sponsor-tiles-row">
          ${byTier[t].map(s => `
            <a href="${s.website_url || '#'}" target="${s.website_url ? '_blank' : '_self'}" rel="noopener" class="sponsor-tile ${t}">
              <div class="sponsor-tile-logo-wrap">
                ${s.logo_url
                  ? `<img src="${s.logo_url}" alt="${s.business_name}" loading="lazy">`
                  : `<span style="font-size:0.8rem;font-weight:700;color:var(--navy,#162447);opacity:0.4">${s.business_name.charAt(0)}</span>`}
              </div>
              <div class="sponsor-tile-name-wrap">
                <div class="sponsor-tile-name">${s.business_name}</div>
                ${s.website_url ? `<span class="sponsor-tile-url">${s.website_url.replace(/^https?:\/\/(www\.)?/, '')}</span>` : ''}
              </div>
            </a>`).join('')}
        </div>
      </div>`);
  });

  return sections.join('');
}
