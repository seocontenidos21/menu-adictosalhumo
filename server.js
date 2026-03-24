const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

/* ─── Security headers ──────────────────────────────────── */
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.path === '/admin' || req.path === '/admin.html') {
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    res.setHeader('Cache-Control', 'no-store');
  }
  next();
});

/* ─── Parse JSON body ───────────────────────────────────── */
app.use(express.json());

/* ─── API: update exchange rates ────────────────────────── */
app.post('/api/update-rate', async (req, res) => {
  const { action, password, tasa_paralela, tasa_bcv } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (action === 'verify') {
    return res.json({ ok: true });
  }

  if (action === 'update') {
    const rateParalela = parseFloat(tasa_paralela);
    const rateBcv = parseFloat(tasa_bcv);

    if (!rateParalela || isNaN(rateParalela) || rateParalela <= 0) {
      return res.status(400).json({ error: 'Tasa paralela inválida' });
    }
    if (!rateBcv || isNaN(rateBcv) || rateBcv <= 0) {
      return res.status(400).json({ error: 'Tasa BCV inválida' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Server configuration missing' });
    }

    try {
      const dbRes = await fetch(`${supabaseUrl}/rest/v1/exchange_rate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({
          tasa_paralela: rateParalela,
          tasa_bcv: rateBcv,
          created_at: new Date().toISOString()
        })
      });

      if (!dbRes.ok) {
        const errText = await dbRes.text();
        console.error('Supabase error:', errText);
        return res.status(500).json({ error: 'Database insert failed' });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error('Fetch error:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(400).json({ error: 'Unknown action' });
});

/* ─── Static files ──────────────────────────────────────── */
app.use(express.static(path.join(__dirname), {
  dotfiles: 'ignore',
  index: false
}));

/* ─── HTML routes ───────────────────────────────────────── */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));      // Próximamente
});

app.get('/desarrollo', (req, res) => {
  res.sendFile(path.join(__dirname, 'desarrollo.html')); // Menú
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));      // Panel admin
});

/* ─── Start ─────────────────────────────────────────────── */
app.listen(PORT, () => {
  console.log(`Adictos al Humo — servidor en puerto ${PORT}`);
});
