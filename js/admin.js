const loginSection = document.getElementById('admin-login');
const panelSection = document.getElementById('admin-panel');
const loginMsg = document.getElementById('login-msg');
const updateMsg = document.getElementById('update-msg');
const currentRateEl = document.getElementById('current-rate');

let adminPass = null;

/* ─── Cargar tasas actuales ─────────────────────────────── */
async function loadCurrentRate() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/exchange_rate?select=tasa_paralela,tasa_bcv,created_at&order=created_at.desc&limit=1`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const fmt = v => parseFloat(v).toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      const updated = new Date(data[0].created_at).toLocaleString('es-VE', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
      currentRateEl.innerHTML =
        `<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">` +
          `<div>Tasa paralela<strong>Bs. ${fmt(data[0].tasa_paralela)} / $1</strong></div>` +
          `<div>Tasa BCV<strong>Bs. ${fmt(data[0].tasa_bcv)} / $1</strong></div>` +
        `</div>` +
        `<span style="font-size:0.68rem;color:#555;display:block;margin-top:4px">Actualizada: ${updated}</span>`;
    }
  } catch {
    currentRateEl.textContent = 'No se pudo cargar las tasas actuales.';
  }
}

/* ─── Login ─────────────────────────────────────────────── */
document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const password = document.getElementById('password-input').value.trim();
  if (!password) return;

  const btn = document.getElementById('login-btn');
  btn.disabled = true;
  btn.textContent = 'VERIFICANDO...';
  loginMsg.textContent = '';

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    });
    const data = await res.json();

    if (data.ok) {
      adminPass = password;
      loginSection.classList.add('hidden');
      panelSection.classList.add('visible');
      loadCurrentRate();
    } else {
      loginMsg.textContent = 'Contraseña incorrecta.';
      loginMsg.className = 'admin-msg err';
    }
  } catch {
    loginMsg.textContent = 'Error de conexión.';
    loginMsg.className = 'admin-msg err';
  } finally {
    btn.disabled = false;
    btn.textContent = 'ACCEDER';
  }
});

/* ─── Guardar tasas ─────────────────────────────────────── */
document.getElementById('rate-form').addEventListener('submit', async e => {
  e.preventDefault();
  const tasa_paralela = parseFloat(document.getElementById('rate-paralela-input').value);
  const tasa_bcv = parseFloat(document.getElementById('rate-bcv-input').value);

  if (!tasa_paralela || tasa_paralela <= 0) {
    updateMsg.textContent = 'Tasa paralela inválida.';
    updateMsg.className = 'admin-msg err';
    return;
  }
  if (!tasa_bcv || tasa_bcv <= 0) {
    updateMsg.textContent = 'Tasa BCV inválida.';
    updateMsg.className = 'admin-msg err';
    return;
  }

  const btn = document.getElementById('update-btn');
  btn.disabled = true;
  btn.textContent = 'GUARDANDO...';
  updateMsg.textContent = '';

  try {
    const res = await fetch('/api/tasas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: adminPass, tasa_paralela, tasa_bcv })
    });
    const data = await res.json();

    if (data.ok) {
      updateMsg.textContent = 'Tasas guardadas.';
      updateMsg.className = 'admin-msg ok';
      document.getElementById('rate-paralela-input').value = '';
      document.getElementById('rate-bcv-input').value = '';
      loadCurrentRate();
    } else {
      updateMsg.textContent = data.error || 'Error al guardar.';
      updateMsg.className = 'admin-msg err';
    }
  } catch {
    updateMsg.textContent = 'Error de conexión.';
    updateMsg.className = 'admin-msg err';
  } finally {
    btn.disabled = false;
    btn.textContent = 'GUARDAR TASAS';
  }
});
