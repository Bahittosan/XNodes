const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS so frontend can call this API
app.use(cors());
app.use(express.json());

// List of public Solana RPC endpoints to test
const RPC_ENDPOINTS = [
  { name: 'Solana Mainnet (Official)', url: 'https://api.mainnet-beta.solana.com' },
  { name: 'Ankr', url: 'https://rpc.ankr.com/solana' },
  { name: 'Helius', url: 'https://mainnet.helius-rpc.com' },
  { name: 'Syndica', url: 'https://solana-mainnet.rpc.syndica.io/api-key/public' },
  { name: 'QuickNode', url: 'https://falling-black-gas.solana-mainnet.quiknode.pro' },
  { name: 'Project Serum', url: 'https://solana-api.projectserum.com' }
];

/**
 * Test a single RPC endpoint by calling getLatestBlockhash
 * Returns: { name, url, latency, status, blockhash, error }
 */
async function testEndpoint(endpoint) {
  const startTime = Date.now();
  
  try {
    // Make JSON-RPC request to get latest blockhash
    const response = await fetch(endpoint.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getLatestBlockhash',
        params: []
      }),
      timeout: 5000 // 5 second timeout
    });

    const endTime = Date.now();
    const latency = endTime - startTime;

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Check if RPC returned valid result
    if (data.error) {
      return {
        name: endpoint.name,
        url: endpoint.url,
        latency: latency,
        status: 'error',
        error: data.error.message,
        blockhash: null
      };
    }

    // Extract blockhash from result
    const blockhash = data.result?.value?.blockhash || 'N/A';

    return {
      name: endpoint.name,
      url: endpoint.url,
      latency: latency,
      status: 'success',
      blockhash: blockhash.substring(0, 10) + '...', // Shorten for display
      error: null
    };

  } catch (error) {
    const endTime = Date.now();
    const latency = endTime - startTime;
    
    return {
      name: endpoint.name,
      url: endpoint.url,
      latency: latency,
      status: 'error',
      error: error.message,
      blockhash: null
    };
  }
}

/**
 * API endpoint to test all RPCs
 * GET /api/test-endpoints
 */
app.get('/api/test-endpoints', async (req, res) => {
  console.log('Testing RPC endpoints...');
  
  try {
    // Test all endpoints in parallel for speed
    const results = await Promise.all(
      RPC_ENDPOINTS.map(endpoint => testEndpoint(endpoint))
    );
    
    // Sort by latency (fastest first)
    const sortedResults = results.sort((a, b) => a.latency - b.latency);
    
    console.log(`Tested ${sortedResults.length} endpoints`);
    
    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      results: sortedResults
    });
    
  } catch (error) {
    console.error('Error testing endpoints:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart RPC Router API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Smart RPC Router API running on http://localhost:${PORT}`);
  console.log(`📊 Test endpoints at: http://localhost:${PORT}/api/test-endpoints`);
});