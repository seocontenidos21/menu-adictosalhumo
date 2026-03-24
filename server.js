require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'css'), { prefix: '/css' }));

/* ─── Archivos estáticos (css, js, img) ─────────────────── */
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));

/* ─── Páginas HTML ──────────────────────────────────────── */
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/desarrollo', (req, res) => res.sendFile(path.join(__dirname, 'desarrollo.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));

/* ─── POST /api/login — verificar contraseña ────────────── */
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (password && password === process.env.ADMIN_PASSWORD) {
    return res.json({ ok: true });
  }
  res.status(401).json({ ok: false });
});

/* ─── POST /api/tasas — guardar tasas en Supabase ────────── */
app.post('/api/tasas', async (req, res) => {
  const { password, tasa_paralela, tasa_bcv } = req.body || {};

  // Verificar contraseña en cada escritura
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  const rate = parseFloat(tasa_paralela);
  const bcv = parseFloat(tasa_bcv);
  if (!rate || rate <= 0 || !bcv || bcv <= 0) {
    return res.status(400).json({ error: 'Tasas inválidas' });
  }

  try {
    const dbRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/exchange_rate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ tasa_paralela: rate, tasa_bcv: bcv, created_at: new Date().toISOString() })
    });

    if (!dbRes.ok) {
      console.error('Supabase:', await dbRes.text());
      return res.status(500).json({ error: 'Error en base de datos' });
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno' });
  }
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
