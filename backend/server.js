const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// ----------------- SECURITY MIDDLEWARE -----------------
app.use(helmet()); // базовые заголовки безопасности

// CORS: разрешаем только твой фронт
app.use(cors({
  origin: 'https://x-nodes.vercel.app' // <-- твой фронт-домен
}));

// Rate limiting: защита от спама/атаки
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 60,             // макс 60 запросов на IP
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

app.use(express.json());

// ----------------- ENV KEYS -----------------
const HELIUS_KEY = process.env.HELIUS_KEY;
const HELIUS_URL = `https://mainnet.helius-rpc.com?api-key=${HELIUS_KEY}`;
const QUICKNODE_URL = process.env.QUICKNODE_URL;

// ----------------- RPC ENDPOINTS -----------------
const RPC_ENDPOINTS = [
  { name: 'Solana Mainnet (Official)', url: 'https://api.mainnet-beta.solana.com' },
  { name: 'Ankr', url: 'https://rpc.ankr.com/solana' },
  { name: 'Helius', url: HELIUS_URL },
  { name: 'Syndica', url: 'https://solana-mainnet.rpc.syndica.io/api-key/public' },
  { name: 'QuickNode', url: QUICKNODE_URL },
  { name: 'Project Serum', url: 'https://solana-api.projectserum.com' }
];

// ----------------- TEST SINGLE ENDPOINT -----------------
async function testEndpoint(endpoint) {
  const startTime = Date.now();

  try {
    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getLatestBlockhash',
        params: []
      }),
      timeout: 5000
    });

    const endTime = Date.now();
    const latency = endTime - startTime;

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    const blockhash = data.result?.value?.blockhash || 'N/A';

    return {
      name: endpoint.name,
      url: endpoint.name, // НЕ показываем полный URL
      latency,
      status: 'success',
      blockhash: blockhash.substring(0, 10) + '...',
      error: null
    };

  } catch (error) {
    const endTime = Date.now();
    const latency = endTime - startTime;

    // Логируем на сервере, но не отдаём ключи клиенту
    console.error(`RPC error for ${endpoint.name}:`, error && error.message ? error.message : error);

    return {
      name: endpoint.name,
      url: endpoint.name,       // безопасно
      latency,
      status: 'error',
      error: 'Failed to fetch', // безопасно для фронта
      blockhash: null
    };
  }
}

// ----------------- API ENDPOINT -----------------
app.get('/api/test-endpoints', async (req, res) => {
  try {
    const results = await Promise.all(
      RPC_ENDPOINTS.map(endpoint => testEndpoint(endpoint))
    );

    const sortedResults = results.sort((a, b) => a.latency - b.latency);

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: sortedResults
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch'
    });
  }
});

// ----------------- HEALTH CHECK -----------------
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart RPC Router API is running' });
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`🚀 Smart RPC Router API running on http://localhost:${PORT}`);
});
