const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const N8N_WEBHOOK = 'https://n8n-production-c543.up.railway.app/webhook/mini-app-transaction';
const N8N_ANALYTICS = 'https://n8n-production-c543.up.railway.app/webhook/analytics-data';

// Проксі для додавання транзакцій
app.post('/submit', async (req, res) => {
  try {
    const response = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    await response.text();
    res.json({ ok: true });
  } catch (e) {
    console.error('Submit proxy error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// Проксі для аналітики
app.post('/analytics', async (req, res) => {
  try {
    const response = await fetch(N8N_ANALYTICS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (e) {
    console.error('Analytics proxy error:', e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
