/* ─── Cart State (module pattern) ─────────────────────────── */
const Cart = (() => {
  let _items = [];

  function _save() {
    try { localStorage.setItem('aah_cart', JSON.stringify(_items)); } catch {}
  }

  function _updateBadge() {
    const el = document.getElementById('cart-badge');
    const n = _items.reduce((s, i) => s + i.qty, 0);
    if (el) { el.textContent = n; el.hidden = n === 0; }
  }

  return {
    load() {
      try { _items = JSON.parse(localStorage.getItem('aah_cart') || '[]'); } catch { _items = []; }
      _updateBadge();
    },

    add(entry) {
      const ex = _items.find(i => i.key === entry.key);
      ex ? (ex.qty += entry.qty) : _items.push({ ...entry });
      _save();
      _updateBadge();
    },

    setQty(key, qty) {
      const idx = _items.findIndex(i => i.key === key);
      if (idx < 0) return;
      qty <= 0 ? _items.splice(idx, 1) : (_items[idx].qty = qty);
      _save();
      _updateBadge();
    },

    items() { return [..._items]; },
    usdTotal() { return _items.reduce((s, i) => s + i.price * i.qty, 0); },
    count() { return _items.reduce((s, i) => s + i.qty, 0); }
  };
})();
