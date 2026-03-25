/* ─── Cart State (module pattern) ─────────────────────────── */
const Cart = (() => {
  let _items = [];
  let _onChange = null;

  function _save() {
    try { localStorage.setItem('aah_cart', JSON.stringify(_items)); } catch {}
  }

  function _updateBadge() {
    const el = document.getElementById('cart-badge');
    const n = _items.reduce((s, i) => s + i.qty, 0);
    if (el) { el.textContent = n; el.hidden = n === 0; }
  }

  function _notify() {
    _updateBadge();
    if (_onChange) _onChange();
  }

  return {
    load() {
      try { _items = JSON.parse(localStorage.getItem('aah_cart') || '[]'); } catch { _items = []; }
      _updateBadge();
    },

    onChange(fn) { _onChange = fn; },

    add(entry) {
      const ex = _items.find(i => i.key === entry.key);
      ex ? (ex.qty += entry.qty) : _items.push({ ...entry });
      _save();
      _notify();
    },

    setQty(key, qty) {
      const idx = _items.findIndex(i => i.key === key);
      if (idx < 0) return;
      qty <= 0 ? _items.splice(idx, 1) : (_items[idx].qty = qty);
      _save();
      _notify();
    },

    items() { return [..._items]; },
    usdTotal() { return _items.reduce((s, i) => s + i.price * i.qty, 0); },
    count() { return _items.reduce((s, i) => s + i.qty, 0); }
  };
})();
