/* ─── State ─────────────────────────────────────────────── */
let currentRate = null;
let rateUpdatedAt = null;
let isBs = false;

/* Modal state */
let modalItem = null;
let modalVariant = null;
let modalQty = 1;

/* ─── Supabase REST ─────────────────────────────────────── */
async function fetchExchangeRate() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/exchange_rate?select=tasa,updated_at&id=eq.1`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
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

function priceText(price) {
  if (isBs && currentRate) {
    return `Bs. ${Math.round(price * currentRate).toLocaleString('es-VE')}`;
  }
  return `$${price}`;
}

/* ─── Placeholder image ─────────────────────────────────── */
const DISH_IMG = 'img/dish-placeholder.svg';

function dishImg(cls = '') {
  return `<img src="${DISH_IMG}" alt="Platillo" class="${cls}" loading="lazy" />`;
}

/* ─── Menu render ───────────────────────────────────────── */

function renderSingleItem(item) {
  const clickable = (item.price !== undefined) ? `data-item-name="${item.name}"` : '';
  return `
    <div class="item-card" ${clickable}>
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
    <div class="item-card" data-item-name="${item.name}">
      <div class="item-name">${item.name}</div>
      ${item.description ? `<div class="item-desc">${item.description}</div>` : ''}
      <div class="item-variants">${variants}</div>
    </div>`;
}

function renderGridItems(items) {
  return `<div class="acomp-grid">${items.map(item => `
    <div class="item-card acomp-card" data-item-name="${item.name}">
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
      <section class="menu-section" id="section-${section.id}" data-section-id="${section.id}">
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
      document.getElementById(`section-${section.id}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    container.appendChild(btn);
  });
}

function initActiveNav() {
  const pills = document.querySelectorAll('.nav-pill');
  const sections = Array.from(document.querySelectorAll('.menu-section'));
  const OFFSET = 88 + 46 + 20; // header + nav + cushion

  function update() {
    let current = sections[0];
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= OFFSET) current = sec;
      else break;
    }
    const id = current.id.replace('section-', '');
    pills.forEach(p => {
      const isActive = p.dataset.section === id;
      if (isActive === p.classList.contains('active')) return;
      p.classList.toggle('active', isActive);
      if (isActive) p.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });
  }

  window.addEventListener('scroll', update, { passive: true });
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

/* ─── Currency toggle ───────────────────────────────────── */
async function toggleCurrency() {
  const pill = document.getElementById('currency-toggle');

  if (!isBs && !currentRate) {
    pill.querySelector('.cpill-text').textContent = '...';
    pill.disabled = true;
    await fetchExchangeRate();
    pill.disabled = false;

    if (!currentRate) {
      pill.querySelector('.cpill-text').textContent = '$ USD';
      alert('No se pudo obtener la tasa de cambio. Intenta más tarde.');
      return;
    }
  }

  isBs = !isBs;
  pill.querySelector('.cpill-text').textContent = isBs ? 'Bs. VES' : '$ USD';
  renderMenu();
  updateRateBar();

  if (document.getElementById('cart-page').classList.contains('open')) {
    renderCartItems();
    renderComplementa();
  }
}

/* ─── Modal ─────────────────────────────────────────────── */
function openModal(sectionId, itemName) {
  const section = MENU_DATA.find(s => s.id === sectionId);
  if (!section) return;
  const item = section.items.find(i => i.name === itemName);
  if (!item) return;
  if (section.layout === 'badges') return; // salsas — no modal

  modalItem = item;
  modalQty = 1;
  modalVariant = item.variants ? item.variants[0] : null;

  document.getElementById('modal-body').innerHTML = buildModalBody(item);
  document.getElementById('qty-val').textContent = '1';

  // Variant selection
  document.querySelectorAll('.modal-variant-row').forEach((row, idx) => {
    row.addEventListener('click', () => {
      document.querySelectorAll('.modal-variant-row').forEach(r => r.classList.remove('selected'));
      row.classList.add('selected');
      modalVariant = modalItem.variants[idx];
    });
  });

  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { modalItem = null; modalVariant = null; modalQty = 1; }, 300);
}

function buildModalBody(item) {
  const variantsHTML = item.variants ? `
    <div class="modal-variants">
      ${item.variants.map((v, i) => `
        <div class="modal-variant-row ${i === 0 ? 'selected' : ''}">
          <span class="modal-variant-name">${v.name}</span>
          <span class="modal-variant-price"><span class="sym">$</span>${v.price}</span>
        </div>`).join('')}
    </div>` : '';

  return `
    <div class="modal-product-header">
      <h2 class="modal-product-name">${item.name}</h2>
      ${item.description ? `<p class="modal-product-desc">${item.description}</p>` : ''}
    </div>
    <div class="modal-photo">${dishImg('modal-photo-img')}</div>
    ${variantsHTML}
    <div class="modal-comments">
      <h3 class="modal-comments-title">COMENTARIOS</h3>
      <textarea class="modal-comments-input" id="modal-comment" placeholder="Añade aquí tus preferencias"></textarea>
    </div>`;
}

function handleAddToCart() {
  if (!modalItem) return;
  const price = modalVariant ? modalVariant.price : modalItem.price;
  const variantName = modalVariant ? modalVariant.name : null;
  const comment = document.getElementById('modal-comment')?.value.trim() || '';
  const key = `${modalItem.name}__${variantName || 'default'}`;

  Cart.add({ key, name: modalItem.name, variantName, price, qty: modalQty, comment });
  closeModal();
}

/* ─── Cart page ─────────────────────────────────────────── */
function openCartPage() {
  renderCartItems();
  renderComplementa();
  document.getElementById('cart-page').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCartPage() {
  document.getElementById('cart-page').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartItems() {
  const items = Cart.items();
  const container = document.getElementById('cart-items-list');
  const totalEl = document.getElementById('cart-header-total');

  const usd = Cart.usdTotal();
  totalEl.textContent = priceText(usd);

  if (items.length === 0) {
    container.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="cart-item">
      <div class="cart-item-photo">${dishImg('cart-item-photo-img')}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${item.variantName ? `<div class="cart-item-variant">${item.variantName}</div>` : ''}
        <div class="cart-item-qty-ctrl">
          <button class="cart-qty-btn" data-key="${item.key}" data-action="minus">−</button>
          <span class="cart-qty-val">${item.qty}</span>
          <button class="cart-qty-btn" data-key="${item.key}" data-action="plus">+</button>
        </div>
      </div>
      <div class="cart-item-price">${priceText(item.price * item.qty)}</div>
    </div>`).join('');

  container.querySelectorAll('.cart-qty-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const item = Cart.items().find(i => i.key === key);
      if (!item) return;
      Cart.setQty(key, btn.dataset.action === 'plus' ? item.qty + 1 : item.qty - 1);
      renderCartItems();
    });
  });
}

function renderComplementa() {
  const section = MENU_DATA.find(s => s.id === 'acomp');
  if (!section) return;
  document.getElementById('complementa-scroll').innerHTML = section.items.map(item => `
    <div class="complementa-card">
      <div class="complementa-photo">${dishImg('complementa-photo-img')}</div>
      <div class="complementa-name">${item.name}</div>
      <div class="complementa-price">${priceText(item.price)}</div>
    </div>`).join('');
}

/* ─── Event delegation — menu cards ─────────────────────── */
function initCardClicks() {
  document.getElementById('menu-content').addEventListener('click', e => {
    const card = e.target.closest('.item-card[data-item-name]');
    if (!card) return;
    const section = card.closest('[data-section-id]');
    if (!section) return;
    openModal(section.dataset.sectionId, card.dataset.itemName);
  });
}

/* ─── Init ──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  Cart.load();
  renderNav();
  renderMenu();
  initActiveNav();
  initCardClicks();
  fetchExchangeRate();

  /* Currency toggle */
  document.getElementById('currency-toggle')
    .addEventListener('click', toggleCurrency);

  /* Cart FAB → open cart page */
  document.getElementById('cart-fab')
    .addEventListener('click', openCartPage);

  /* Cart back button */
  document.getElementById('cart-back')
    .addEventListener('click', closeCartPage);

  /* Modal close */
  document.getElementById('modal-close')
    .addEventListener('click', closeModal);

  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  /* Modal qty */
  document.getElementById('qty-minus').addEventListener('click', () => {
    if (modalQty > 1) { modalQty--; document.getElementById('qty-val').textContent = modalQty; }
  });
  document.getElementById('qty-plus').addEventListener('click', () => {
    modalQty++; document.getElementById('qty-val').textContent = modalQty;
  });

  /* Add to cart */
  document.getElementById('add-btn').addEventListener('click', handleAddToCart);

  /* Service type buttons → WhatsApp order */
  const WA_NUMBER = '584247779990';
  const SERVICE_LABEL = { local: 'En el local', llevar: 'Para llevar', domicilio: 'A domicilio' };

  document.querySelectorAll('.service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.service-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const items = Cart.items();
      if (!items.length) return;

      const service = btn.dataset.service;
      const lines = items.map(it => {
        const variantSuffix = it.variant ? ` (${it.variant})` : '';
        const commentSuffix = it.comment ? ` — "${it.comment}"` : '';
        return `\u2022 ${it.qty}x ${it.name}${variantSuffix}${commentSuffix}`;
      });
      const total = Cart.usdTotal();

      const msg = [
        `\u{1F969} *Pedido \u2014 Adictos al Humo Smokehouse*`,
        `\u{1F4E6} Tipo: *${SERVICE_LABEL[service]}*`,
        ``,
        ...lines,
        ``,
        `\u{1F4B5} Total: *$${total.toFixed(2)}*`,
      ].join('\n');

      window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
    });
  });
});
