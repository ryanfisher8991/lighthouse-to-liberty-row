function renderSponsorTiles(sponsors) {
  const byTier = { gold: [], silver: [], bronze: [] };
  sponsors.forEach(s => { if (byTier[s.tier]) byTier[s.tier].push(s); });

  const tierLabels = { gold: 'Gold Sponsors', silver: 'Silver Sponsors', bronze: 'Bronze Sponsors' };

  return ['gold', 'silver', 'bronze']
    .filter(t => byTier[t].length)
    .map(t => `
      <div class="sponsor-tier-group">
        <div class="sponsor-tier-label ${t}">${tierLabels[t]}</div>
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
            </a>
          `).join('')}
        </div>
      </div>
    `).join('');
}
