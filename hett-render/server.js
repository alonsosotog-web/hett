const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const JSONBIN_KEY = process.env.JSONBIN_KEY;
const JSONBIN_BIN = process.env.JSONBIN_BIN;
const JSONBIN_URL = 'https://api.jsonbin.io/v3/b';

const MIME = {
  '.html': 'text/html', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png',
  '.css': 'text/css', '.webmanifest': 'application/manifest+json'
};

async function fetchJSON(url, opts) {
  const { default: fetch } = await import('node-fetch');
  const r = await fetch(url, opts);
  return r.json();
}

async function getDB() {
  const data = await fetchJSON(`${JSONBIN_URL}/${JSONBIN_BIN}/latest`, {
    headers: { 'X-Master-Key': JSONBIN_KEY }
  });
  return data.record || { sessions: {}, results: [] };
}

async function saveDB(data) {
  const { default: fetch } = await import('node-fetch');
  await fetch(`${JSONBIN_URL}/${JSONBIN_BIN}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_KEY },
    body: JSON.stringify(data)
  });
}

async function handleAPI(body) {
  if (body.action === 'save_session') {
    const db = await getDB();
    db.sessions = db.sessions || {};
    db.sessions[body.code] = body.quiz;
    db.sessions['__latest__'] = { ...body.quiz, sessionCode: body.code };
    await saveDB(db);
    return { ok: true };
  }
  if (body.action === 'get_session') {
    const db = await getDB();
    const quiz = (db.sessions || {})[body.code] || null;
    if (!quiz) throw Object.assign(new Error('Sesión no encontrada'), { status: 404 });
    return { quiz };
  }
  if (body.action === 'save_result') {
    const db = await getDB();
    db.results = db.results || [];
    db.results.push(body.result);
    await saveDB(db);
    return { ok: true };
  }
  if (body.action === 'get_results') {
    const db = await getDB();
    return { results: db.results || [] };
  }
  if (body.action === 'clear_data') {
    await saveDB({ sessions: {}, results: [] });
    return { ok: true };
  }

  // Generate AI test
  const messages = body.messages.map(m => ({
    role: m.role,
    content: Array.isArray(m.content) ? m.content.map(c => c.text || '').join('\n') : m.content
  }));

  const models = [
    'mistralai/mistral-small-3.1-24b-instruct:free',
    'google/gemma-3-12b-it:free',
    'google/gemma-3-4b-it:free',
    'microsoft/phi-4-reasoning:free',
    'meta-llama/llama-4-scout:free',
    'meta-llama/llama-4-maverick:free'
  ];

  const { default: fetch } = await import('node-fetch');
  const errors = [];
  for (const model of models) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://hett-recoleta.onrender.com',
          'X-Title': 'HETT Estudio Biblico'
        },
        body: JSON.stringify({ model, messages, max_tokens: 1500 })
      });
      const data = await res.json();
      if (res.ok && data.choices?.[0]?.message?.content) {
        return { content: [{ type: 'text', text: data.choices[0].message.content }] };
      }
      errors.push(`${model}: ${JSON.stringify(data.error || '')}`);
    } catch(e) { errors.push(`${model}: ${e.message}`); }
  }
  throw new Error('Todos los modelos fallaron: ' + errors.join(' | '));
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // API endpoint
  if (req.url === '/api' && req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', async () => {
      try {
        const parsed = JSON.parse(body);
        const result = await handleAPI(parsed);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result));
      } catch(e) {
        res.writeHead(e.status || 500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: e.message } }));
      }
    });
    return;
  }

  // Static files
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for SPA
      fs.readFile(path.join(__dirname, 'index.html'), (err2, data2) => {
        if (err2) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data2);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`HETT server running on port ${PORT}`));
