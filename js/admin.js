const API = '/.netlify/functions/update-rate';
let adminPass = null;

const loginSection = document.getElementById('admin-login');
const panelSection = document.getElementById('admin-panel');
const loginMsg = document.getElementById('login-msg');
const updateMsg = document.getElementById('update-msg');
const currentRateEl = document.getElementById('current-rate');

/* ─── Fetch current rate to display ────────────────────── */
async function loadCurrentRate() {
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
      const rate = parseFloat(data[0].tasa).toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      const updated = new Date(data[0].updated_at).toLocaleString('es-VE', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
      currentRateEl.innerHTML = `Tasa actual<strong>Bs. ${rate} / $1</strong><span style="font-size:0.68rem;color:#555">Actualizada: ${updated}</span>`;
    }
  } catch {
    currentRateEl.textContent = 'No se pudo cargar la tasa actual.';
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
  loginMsg.className = 'admin-msg';

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', password })
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
    loginMsg.textContent = 'Error de conexión. Intenta nuevamente.';
    loginMsg.className = 'admin-msg err';
  } finally {
    btn.disabled = false;
    btn.textContent = 'ACCEDER';
  }
});

/* ─── Update rate ────────────────────────────────────────── */
document.getElementById('rate-form').addEventListener('submit', async e => {
  e.preventDefault();
  const tasa = parseFloat(document.getElementById('rate-input').value);

  if (!tasa || isNaN(tasa) || tasa <= 0) {
    updateMsg.textContent = 'Ingresa una tasa válida mayor a 0.';
    updateMsg.className = 'admin-msg err';
    return;
  }

  const btn = document.getElementById('update-btn');
  btn.disabled = true;
  btn.textContent = 'GUARDANDO...';
  updateMsg.textContent = '';
  updateMsg.className = 'admin-msg';

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', password: adminPass, tasa })
    });
    const data = await res.json();

    if (data.success) {
      updateMsg.textContent = `Tasa actualizada a Bs. ${tasa.toLocaleString('es-VE')} / $1`;
      updateMsg.className = 'admin-msg ok';
      document.getElementById('rate-input').value = '';
      loadCurrentRate();
    } else {
      updateMsg.textContent = data.error || 'Error al guardar. Intenta nuevamente.';
      updateMsg.className = 'admin-msg err';
    }
  } catch {
    updateMsg.textContent = 'Error de conexión. Intenta nuevamente.';
    updateMsg.className = 'admin-msg err';
  } finally {
    btn.disabled = false;
    btn.textContent = 'GUARDAR TASA';
  }
});
