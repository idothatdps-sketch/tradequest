/* =====================================================
   CLOUDFLARE WORKER - MARKET DATA PROXY
   Sichere API-Proxies für Live-Marktdaten
===================================================== */

// Cachen-Konfiguration (Sekunden)
const CACHE_TTL = {
  crypto: 10,      // Krypto alle 10 Sekunden aktualisieren
  stocks: 60,      // Aktien alle 60 Sekunden
  forex: 30,       // Forex alle 30 Sekunden
  commodities: 30  // Rohstoffe alle 30 Sekunden
};

// API-Endpoints
const APIS = {
  crypto: 'https://api.coingecko.com/api/v3',
  forex: 'https://api.exchangerate-api.com/v4/latest',
  stocks: 'https://finnhub.io/api/v1'
};

/**
 * Hole Kryptowährungspreise von CoinGecko
 */
async function getCryptoPrice(symbols) {
  try {
    const ids = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'XRP': 'ripple'
    };
    
    const coinIds = symbols.map(s => ids[s]).filter(Boolean).join(',');
    if (!coinIds) return null;
    
    const url = `${APIS.crypto}/simple/price?ids=${coinIds}&vs_currencies=eur&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`CoinGecko API error: ${response.status}`);
    
    const data = await response.json();
    const result = {};
    
    Object.entries(ids).forEach(([symbol, coinId]) => {
      if (data[coinId]) {
        result[symbol] = {
          price: data[coinId].eur,
          change24h: data[coinId].eur_24h_change || 0,
          timestamp: Date.now(),
          source: 'coingecko'
        };
      }
    });
    
    return result;
  } catch (error) {
    console.error('Crypto API Error:', error);
    return null;
  }
}

/**
 * Hole Aktienpreise von Finnhub (kostenlos)
 */
async function getStockPrice(symbol, apiKey) {
  try {
    const url = `${APIS.stocks}/quote?symbol=${symbol}&token=${apiKey}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`Finnhub API error: ${response.status}`);
    
    const data = await response.json();
    
    if (data.c === undefined) return null;
    
    // Berechne 24h-Änderung aus Open und Current
    const change24h = data.o ? ((data.c - data.o) / data.o * 100) : 0;
    
    return {
      [symbol]: {
        price: data.c,
        change24h: change24h,
        high: data.h,
        low: data.l,
        open: data.o,
        timestamp: Date.now(),
        source: 'finnhub'
      }
    };
  } catch (error) {
    console.error(`Stock API Error for ${symbol}:`, error);
    return null;
  }
}

/**
 * Hole Forex-Kurse
 */
async function getForexPrice(baseCurrency) {
  try {
    const url = `${APIS.forex}/${baseCurrency}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error(`Forex API error: ${response.status}`);
    
    const data = await response.json();
    
    // EUR zu USD
    if (baseCurrency === 'EUR' && data.rates && data.rates.USD) {
      return {
        'EURUSD': {
          price: data.rates.USD,
          change24h: 0, // API liefert keine 24h-Änderung
          timestamp: Date.now(),
          source: 'exchangerate-api'
        }
      };
    }
    
    return null;
  } catch (error) {
    console.error('Forex API Error:', error);
    return null;
  }
}

/**
 * Hole Gold-Preis (vereinfacht)
 */
async function getCommodityPrice() {
  try {
    // Fallback: Verwende einen festen Startwert
    // In der Praxis würde man hier eine echte Commodity-API verwenden
    return {
      'GOLD': {
        price: 3370,
        change24h: 0,
        timestamp: Date.now(),
        source: 'fallback'
      }
    };
  } catch (error) {
    console.error('Commodity API Error:', error);
    return null;
  }
}

/**
 * Hole alle Marktdaten
 */
async function getAllMarketData(env) {
  const result = {
    timestamp: Date.now(),
    data: {},
    status: 'partial'
  };
  
  try {
    // Krypto-Daten
    const cryptoData = await getCryptoPrice(['BTC', 'ETH', 'SOL', 'XRP']);
    if (cryptoData) Object.assign(result.data, cryptoData);
    
    // Aktien-Daten (benötigt API-Key)
    const finnhubKey = env.FINNHUB_API_KEY || '';
    if (finnhubKey) {
      for (const symbol of ['AAPL', 'NVDA', 'TSLA', 'MSFT']) {
        const stockData = await getStockPrice(symbol, finnhubKey);
        if (stockData) Object.assign(result.data, stockData);
      }
    }
    
    // ETF-Daten (vereinfacht mit Fallback)
    const etfFallback = {
      'SPY': { price: 646, change24h: 0, timestamp: Date.now(), source: 'fallback' },
      'QQQ': { price: 575, change24h: 0, timestamp: Date.now(), source: 'fallback' }
    };
    Object.assign(result.data, etfFallback);
    
    // Forex-Daten
    const forexData = await getForexPrice('EUR');
    if (forexData) Object.assign(result.data, forexData);
    
    // Commodity-Daten
    const commodityData = await getCommodityPrice();
    if (commodityData) Object.assign(result.data, commodityData);
    
    result.status = Object.keys(result.data).length > 0 ? 'success' : 'error';
    
    return result;
  } catch (error) {
    console.error('Market Data Fetch Error:', error);
    result.status = 'error';
    return result;
  }
}

/**
 * Handle-Anfrage
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS-Header
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }
    
    // Route: /api/market-data
    if (url.pathname === '/api/market-data') {
      try {
        const cacheKey = new Request(url, { method: 'GET' });
        const cache = caches.default;
        
        // Versuche aus Cache zu laden
        let response = await cache.match(cacheKey);
        
        if (!response) {
          // Hole frische Daten
          const marketData = await getAllMarketData(env);
          
          response = new Response(JSON.stringify(marketData), {
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': `public, max-age=${CACHE_TTL.crypto}`,
              ...corsHeaders
            }
          });
          
          // Speichere im Cache
          await cache.put(cacheKey, response.clone());
        }
        
        return response;
      } catch (error) {
        return new Response(
          JSON.stringify({ error: error.message, status: 'error' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          }
        );
      }
    }
    
    // Route: /api/crypto/:symbol
    if (url.pathname.match(/^\/api\/crypto\//)) {
      const symbol = url.pathname.split('/').pop().toUpperCase();
      const data = await getCryptoPrice([symbol]);
      
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${CACHE_TTL.crypto}`,
          ...corsHeaders
        }
      });
    }
    
    // Route: /api/stock/:symbol
    if (url.pathname.match(/^\/api\/stock\//)) {
      const symbol = url.pathname.split('/').pop().toUpperCase();
      const apiKey = env.FINNHUB_API_KEY;
      
      if (!apiKey) {
        return new Response(
          JSON.stringify({ error: 'API Key nicht konfiguriert' }),
          { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
      
      const data = await getStockPrice(symbol, apiKey);
      
      return new Response(JSON.stringify(data), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': `public, max-age=${CACHE_TTL.stocks}`,
          ...corsHeaders
        }
      });
    }
    
    // 404
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }
};
