/* ─── State ─────────────────────────────────────────────── */
let currentRate = null;
let rateUpdatedAt = null;
let isBs = false;

/* ─── Supabase REST fetch ───────────────────────────────── */
async function fetchExchangeRate() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/exchange_rate?select=tasa,updated_at&id=eq.1`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      currentRate = parseFloat(data[0].tasa);
      rateUpdatedAt = new Date(data[0].updated_at);
    }
  } catch (e) {
    console.warn('No se pudo obtener la tasa:', e);
  }
}

/* ─── Price formatting ──────────────────────────────────── */
function priceHTML(price) {
  if (isBs && currentRate) {
    const bs = Math.round(price * currentRate);
    return `<span class="sym">Bs.</span>&nbsp;${bs.toLocaleString('es-VE')}`;
  }
  return `<span class="sym">$</span>${price}`;
}

/* ─── Render helpers ────────────────────────────────────── */
function renderSingleItem(item) {
  return `
    <div class="item-card">
      <div class="item-header">
        <div class="item-name">${item.name}</div>
        <div class="item-price">${priceHTML(item.price)}</div>
      </div>
      ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
    </div>`;
}

function renderVariantItem(item) {
  const variants = item.variants.map(v => `
    <div class="variant-row">
      <span class="variant-name">${v.name}</span>
      <span class="variant-price">${priceHTML(v.price)}</span>
    </div>`).join('');

  return `
    <div class="item-card">
      <div class="item-name">${item.name}</div>
      ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
      <div class="item-variants">${variants}</div>
    </div>`;
}

function renderGridItems(items) {
  return `<div class="acomp-grid">${items.map(item => `
    <div class="item-card acomp-card">
      <div class="item-name">${item.name}</div>
      <div class="item-price">${priceHTML(item.price)}</div>
    </div>`).join('')}</div>`;
}

function renderBadgeItems(section) {
  return `
    ${section.subtitle ? `<p class="salsas-subtitle">${section.subtitle}</p>` : ''}
    <div class="salsas-grid">
      ${section.items.map(item => `<span class="salsa-badge">${item.name}</span>`).join('')}
    </div>`;
}

/* ─── Render full menu ──────────────────────────────────── */
function renderMenu() {
  const container = document.getElementById('menu-content');
  container.innerHTML = MENU_DATA.map(section => {
    let body = '';

    if (section.layout === 'badges') {
      body = renderBadgeItems(section);
    } else if (section.layout === 'grid') {
      body = renderGridItems(section.items);
    } else {
      body = section.items.map(item =>
        item.variants ? renderVariantItem(item) : renderSingleItem(item)
      ).join('');
    }

    return `
      <section class="menu-section" id="section-${section.id}">
        <div class="section-header">
          <h2 class="section-title">${section.name.toUpperCase()}</h2>
          <div class="section-divider"></div>
        </div>
        ${body}
      </section>`;
  }).join('');
}

/* ─── Nav ───────────────────────────────────────────────── */
function renderNav() {
  const container = document.getElementById('nav-pills');
  MENU_DATA.forEach(section => {
    const btn = document.createElement('button');
    btn.className = 'nav-pill';
    btn.dataset.section = section.id;
    btn.textContent = section.name;
    btn.addEventListener('click', () => {
      const target = document.getElementById(`section-${section.id}`);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    container.appendChild(btn);
  });
}

function initActiveNav() {
  const pills = document.querySelectorAll('.nav-pill');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id.replace('section-', '');
      pills.forEach(p => p.classList.toggle('active', p.dataset.section === id));
      const activePill = document.querySelector('.nav-pill.active');
      if (activePill) {
        activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    });
  }, { threshold: 0.25, rootMargin: '-70px 0px -55% 0px' });

  document.querySelectorAll('.menu-section').forEach(s => observer.observe(s));
  pills[0]?.classList.add('active');
}

/* ─── Rate bar ──────────────────────────────────────────── */
function updateRateBar() {
  const bar = document.getElementById('rate-bar');
  const rateVal = document.getElementById('rate-value');
  const rateDate = document.getElementById('rate-date');

  if (isBs && currentRate) {
    rateVal.textContent = currentRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (rateUpdatedAt) {
      rateDate.textContent = rateUpdatedAt.toLocaleDateString('es-VE', {
        day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
      });
    }
    bar.classList.add('visible');
  } else {
    bar.classList.remove('visible');
  }
}

/* ─── Toggle currency ───────────────────────────────────── */
async function toggleCurrency() {
  const fab = document.getElementById('currency-toggle');

  if (!isBs && !currentRate) {
    fab.textContent = '...';
    fab.disabled = true;
    await fetchExchangeRate();
    fab.disabled = false;

    if (!currentRate) {
      fab.textContent = '$ USD';
      alert('No se pudo obtener la tasa de cambio. Intenta más tarde.');
      return;
    }
  }

  isBs = !isBs;
  fab.innerHTML = isBs
    ? '<span class="fab-dot"></span>Bs.'
    : '<span class="fab-dot"></span>$ USD';
  fab.classList.toggle('bs-mode', isBs);

  renderMenu();
  updateRateBar();
}

/* ─── Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  renderMenu();
  initActiveNav();

  document.getElementById('currency-toggle')
    .addEventListener('click', toggleCurrency);

  // Prefetch rate silently
  fetchExchangeRate();
});
