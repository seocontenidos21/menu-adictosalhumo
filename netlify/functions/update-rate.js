exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { action, password, tasa } = body;

  /* ─── Verify password ─────────────────────────────────── */
  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  /* ─── Action: verify ──────────────────────────────────── */
  if (action === 'verify') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  /* ─── Action: update ──────────────────────────────────── */
  if (action === 'update') {
    const rate = parseFloat(tasa);
    if (!rate || isNaN(rate) || rate <= 0) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid rate value' }) };
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Server configuration missing' }) };
    }

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/exchange_rate?id=eq.1`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: 'return=minimal'
        },
        body: JSON.stringify({ tasa: rate, updated_at: new Date().toISOString() })
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('Supabase error:', errText);
        return { statusCode: 500, headers, body: JSON.stringify({ error: 'Database update failed' }) };
      }

      return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
    } catch (err) {
      console.error('Fetch error:', err);
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
    }
  }

  return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unknown action' }) };
};
