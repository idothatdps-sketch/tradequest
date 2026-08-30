/* =====================================================
   TRADEQUEST - COINBASE STYLE CRYPTO TRADING GAME
   Live Crypto Prices with €1000 Virtual Capital
===================================================== */

const CRYPTOS = {
  BTC: { name: 'Bitcoin', symbol: 'BTC', icon: '₿', startPrice: 62000 },
  ETH: { name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', startPrice: 2800 },
  SOL: { name: 'Solana', symbol: 'SOL', icon: 'S', startPrice: 145 },
  XRP: { name: 'XRP', symbol: 'XRP', icon: 'X', startPrice: 2.65 }
};

// Game State
let state = JSON.parse(localStorage.getItem('tradequest')) || {
  cash: 1000,
  startingCash: 1000,
  positions: {},
  trades: [],
  createdAt: Date.now()
};

// Market Data
let prices = {};
let priceHistory = {};
let priceChanges = {};
let openPrice = {};
let currentSection = 'portfolio';
let currentTradeCoin = null;
let currentOrderSide = 'buy';

// Initialize prices
Object.keys(CRYPTOS).forEach(symbol => {
  prices[symbol] = CRYPTOS[symbol].startPrice;
  priceHistory[symbol] = [CRYPTOS[symbol].startPrice];
  priceChanges[symbol] = 0;
  openPrice[symbol] = CRYPTOS[symbol].startPrice;
});

/* =========================
   STORAGE
========================= */
function save() {
  localStorage.setItem('tradequest', JSON.stringify(state));
}

/* =========================
   FORMATTING
========================= */
function formatMoney(value) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatPrice(value) {
  if (value < 10) {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(value);
  }
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatCrypto(value) {
  return parseFloat(value).toFixed(8);
}

/* =========================
   MARKET DATA - COINGECKO API
========================= */
async function fetchLiveMarketData() {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,ripple&vs_currencies=eur&include_market_cap=true&include_24hr_change=true'
    );

    if (!response.ok) throw new Error('API Error');

    const data = await response.json();

    // Update Bitcoin
    if (data.bitcoin) {
      const oldPrice = prices.BTC;
      prices.BTC = data.bitcoin.eur;
      priceChanges.BTC = data.bitcoin.eur_24h_change || 0;
      priceHistory.BTC.push(prices.BTC);
      if (priceHistory.BTC.length > 100) priceHistory.BTC.shift();
    }

    // Update Ethereum
    if (data.ethereum) {
      const oldPrice = prices.ETH;
      prices.ETH = data.ethereum.eur;
      priceChanges.ETH = data.ethereum.eur_24h_change || 0;
      priceHistory.ETH.push(prices.ETH);
      if (priceHistory.ETH.length > 100) priceHistory.ETH.shift();
    }

    // Update Solana
    if (data.solana) {
      const oldPrice = prices.SOL;
      prices.SOL = data.solana.eur;
      priceChanges.SOL = data.solana.eur_24h_change || 0;
      priceHistory.SOL.push(prices.SOL);
      if (priceHistory.SOL.length > 100) priceHistory.SOL.shift();
    }

    // Update XRP
    if (data.ripple) {
      const oldPrice = prices.XRP;
      prices.XRP = data.ripple.eur;
      priceChanges.XRP = data.ripple.eur_24h_change || 0;
      priceHistory.XRP.push(prices.XRP);
      if (priceHistory.XRP.length > 100) priceHistory.XRP.shift();
    }

    updateUI();
  } catch (error) {
    console.warn('Market data fetch error:', error);
    // Fallback: keep using cached prices
  }
}

/* =========================
   PORTFOLIO CALCULATIONS
========================= */
function getPortfolioValue() {
  let total = state.cash;
  Object.entries(state.positions).forEach(([symbol, amount]) => {
    total += amount * prices[symbol];
  });
  return total;
}

function getInvestedValue() {
  let total = 0;
  Object.entries(state.positions).forEach(([symbol, amount]) => {
    total += amount * prices[symbol];
  });
  return total;
}

function getPnL() {
  const current = getPortfolioValue();
  return current - state.startingCash;
}

function getPnLPercent() {
  const pnl = getPnL();
  return (pnl / state.startingCash) * 100;
}

/* =========================
   UI UPDATE
========================= */
function updateUI() {
  if (currentSection === 'portfolio') {
    renderPortfolio();
  } else if (currentSection === 'markets') {
    renderMarkets();
  } else if (currentSection === 'trade') {
    updateTradeUI();
  }
}

function updateHeader() {
  const portfolioValue = getPortfolioValue();
  document.getElementById('headerBalance').textContent = formatMoney(state.cash);

  // Update ticker
  document.getElementById('tickerBTC').textContent = formatPrice(prices.BTC);
  document.getElementById('tickerBTCChange').textContent = formatChange(priceChanges.BTC);
  document.getElementById('tickerBTCChange').className = `ticker-change ${priceChanges.BTC >= 0 ? 'green' : 'red'}`;

  document.getElementById('tickerETH').textContent = formatPrice(prices.ETH);
  document.getElementById('tickerETHChange').textContent = formatChange(priceChanges.ETH);
  document.getElementById('tickerETHChange').className = `ticker-change ${priceChanges.ETH >= 0 ? 'green' : 'red'}`;

  document.getElementById('tickerSOL').textContent = formatPrice(prices.SOL);
  document.getElementById('tickerSOLChange').textContent = formatChange(priceChanges.SOL);
  document.getElementById('tickerSOLChange').className = `ticker-change ${priceChanges.SOL >= 0 ? 'green' : 'red'}`;
}

function formatChange(value) {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function renderPortfolio() {
  const total = getPortfolioValue();
  const invested = getInvestedValue();
  const pnl = getPnL();
  const pnlPercent = getPnLPercent();

  // Stats
  document.getElementById('portfolioTotal').textContent = formatMoney(total);
  document.getElementById('portfolioCash').textContent = formatMoney(state.cash);
  document.getElementById('portfolioInvested').textContent = formatMoney(invested);

  const changeEl = document.getElementById('portfolioChange');
  changeEl.textContent = `${pnl >= 0 ? '+' : ''}${formatMoney(pnl)} (${pnl >= 0 ? '+' : ''}${pnlPercent.toFixed(2)}%)`;
  changeEl.className = `stat-change ${pnl >= 0 ? 'green' : 'red'}`;

  // Assets List
  const assetsList = document.getElementById('assetsList');
  const positions = Object.entries(state.positions);

  if (positions.length === 0) {
    assetsList.innerHTML = '<div class="asset-empty">Noch keine Coins gekauft. Starten Sie Ihren ersten Trade!</div>';
  } else {
    assetsList.innerHTML = positions
      .map(([symbol, amount]) => {
        const crypto = CRYPTOS[symbol];
        const currentValue = amount * prices[symbol];
        const costPerUnit = state.trades
          .filter(t => t.symbol === symbol && t.side === 'buy')
          .reduce((sum, t) => sum + t.price * t.amount, 0) / 
          state.trades.filter(t => t.symbol === symbol && t.side === 'buy').reduce((sum, t) => sum + t.amount, 0);
        
        const pnlAsset = (prices[symbol] - costPerUnit) * amount;
        const pnlPercentAsset = ((prices[symbol] - costPerUnit) / costPerUnit) * 100;

        return `
          <div class="asset-item">
            <div class="asset-header">
              <div class="asset-icon">${crypto.icon}</div>
              <div class="asset-info">
                <div class="asset-name">${crypto.name}</div>
                <div class="asset-amount">${formatCrypto(amount)} ${symbol}</div>
              </div>
            </div>
            <div class="asset-value">
              <div class="asset-value-main">${formatMoney(currentValue)}</div>
            </div>
            <div class="asset-value">
              <div class="asset-value-change ${pnlAsset >= 0 ? 'green' : 'red'}">
                ${pnlAsset >= 0 ? '+' : ''}${formatMoney(pnlAsset)} (${pnlAsset >= 0 ? '+' : ''}${pnlPercentAsset.toFixed(2)}%)
              </div>
            </div>
          </div>
        `;
      })
      .join('');
  }
}

function renderMarkets() {
  Object.keys(CRYPTOS).forEach(symbol => {
    const el = document.getElementById(`market${symbol}Price`);
    if (el) el.textContent = formatPrice(prices[symbol]);

    const changeEl = document.getElementById(`market${symbol}Change`);
    if (changeEl) {
      changeEl.textContent = formatChange(priceChanges[symbol]);
      changeEl.className = `market-change ${priceChanges[symbol] >= 0 ? 'green' : 'red'}`;
    }
  });
}

function updateTradeUI() {
  if (!currentTradeCoin) return;

  const crypto = CRYPTOS[currentTradeCoin];
  const price = prices[currentTradeCoin];
  const change = priceChanges[currentTradeCoin];

  // Update chart header
  document.getElementById('chartIcon').textContent = crypto.icon;
  document.getElementById('chartName').textContent = crypto.name;
  document.getElementById('chartSymbol').textContent = currentTradeCoin;
  document.getElementById('chartPrice').textContent = formatPrice(price);
  document.getElementById('chartChange').textContent = formatChange(change);
  document.getElementById('chartChange').className = `chart-change ${change >= 0 ? 'green' : 'red'}`;

  // Update order form
  document.getElementById('orderPrice').value = formatPrice(price);
  document.getElementById('orderAvailable').textContent = formatMoney(state.cash);

  // Update total when quantity changes
  updateOrderTotal();

  // Draw chart
  drawChart(currentTradeCoin);
}

function updateOrderTotal() {
  const quantity = parseFloat(document.getElementById('orderQuantity').value) || 0;
  const price = prices[currentTradeCoin];
  const subtotal = quantity * price;
  const fee = subtotal * 0.005;
  const total = subtotal + fee;

  document.getElementById('orderTotal').value = formatMoney(total);
  document.getElementById('orderFee').textContent = formatMoney(fee);

  // Update button state
  const btn = document.getElementById('submitOrderBtn');
  if (currentOrderSide === 'buy') {
    if (total > state.cash) {
      btn.disabled = true;
      btn.style.opacity = '0.5';
    } else {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  } else {
    const holding = state.positions[currentTradeCoin] || 0;
    if (quantity > holding) {
      btn.disabled = true;
      btn.style.opacity = '0.5';
    } else {
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }
}

/* =========================
   CHART DRAWING
========================= */
function drawChart(symbol) {
  const canvas = document.getElementById('chart');
  if (!canvas || !canvas.offsetWidth) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  canvas.width = width * 2;
  canvas.height = height * 2;
  ctx.scale(2, 2);

  const data = priceHistory[symbol] || [];

  if (data.length < 2) {
    ctx.fillStyle = 'rgba(0, 82, 255, 0.05)';
    ctx.fillRect(0, 0, width, height);
    return;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  // Draw line
  ctx.beginPath();
  data.forEach((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * (height - 40) - 20;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });

  ctx.strokeStyle = '#0052ff';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Fill area
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = 'rgba(0, 82, 255, 0.1)';
  ctx.fill();
}

/* =========================
   TRADING
========================= */
function openTrade(symbol) {
  currentTradeCoin = symbol;
  currentOrderSide = 'buy';
  document.getElementById('orderQuantity').value = '';
  document.getElementById('portfolio-section').classList.remove('active');
  document.getElementById('markets-section').classList.remove('active');
  document.getElementById('trade-section').classList.add('active');

  // Update tab buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn')[0].classList.add('active');

  // Update submit button
  const btn = document.getElementById('submitOrderBtn');
  btn.textContent = 'Kaufen';
  btn.className = 'btn-buy';

  updateTradeUI();
  currentSection = 'trade';
}

function closeTradeSection() {
  currentTradeCoin = null;
  switchSection('markets');
}

function switchOrderTab(side) {
  currentOrderSide = side;
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');

  const btn = document.getElementById('submitOrderBtn');
  if (side === 'buy') {
    btn.textContent = 'Kaufen';
    btn.className = 'btn-buy';
  } else {
    btn.textContent = 'Verkaufen';
    btn.className = 'btn-buy sell';
  }

  updateOrderTotal();
}

function submitOrder() {
  const quantity = parseFloat(document.getElementById('orderQuantity').value);
  if (!quantity || quantity <= 0) {
    showNotification('Bitte geben Sie eine gültige Menge ein', 'error');
    return;
  }

  const price = prices[currentTradeCoin];
  const subtotal = quantity * price;
  const fee = subtotal * 0.005;
  const total = subtotal + fee;

  if (currentOrderSide === 'buy') {
    if (total > state.cash) {
      showNotification('Nicht genug Guthaben verfügbar', 'error');
      return;
    }

    state.cash -= total;
    if (!state.positions[currentTradeCoin]) {
      state.positions[currentTradeCoin] = 0;
    }
    state.positions[currentTradeCoin] += quantity;

    showNotification(`${quantity} ${currentTradeCoin} gekauft`, 'success');
  } else {
    const holding = state.positions[currentTradeCoin] || 0;
    if (quantity > holding) {
      showNotification('Du besitzt nicht genug von diesem Coin', 'error');
      return;
    }

    state.cash += total - fee;
    state.positions[currentTradeCoin] -= quantity;

    if (state.positions[currentTradeCoin] <= 0) {
      delete state.positions[currentTradeCoin];
    }

    showNotification(`${quantity} ${currentTradeCoin} verkauft`, 'success');
  }

  state.trades.push({
    id: Date.now(),
    symbol: currentTradeCoin,
    side: currentOrderSide,
    amount: quantity,
    price: price,
    fee: fee,
    date: new Date().toLocaleString('de-DE')
  });

  save();
  updateHeader();
  renderPortfolio();
  document.getElementById('orderQuantity').value = '';
  updateOrderTotal();
}

/* =========================
   NAVIGATION
========================= */
function switchSection(section) {
  document.getElementById('portfolio-section').classList.remove('active');
  document.getElementById('markets-section').classList.remove('active');
  document.getElementById('trade-section').classList.remove('active');

  if (section === 'portfolio') {
    document.getElementById('portfolio-section').classList.add('active');
  } else if (section === 'markets') {
    document.getElementById('markets-section').classList.add('active');
  }

  currentSection = section;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.closest('.nav-btn').classList.add('active');

  renderPortfolio();
  renderMarkets();
}

/* =========================
   NOTIFICATIONS
========================= */
function showNotification(message, type = 'success') {
  const el = document.getElementById('notification');
  el.textContent = message;
  el.className = `notification show ${type}`;

  setTimeout(() => {
    el.classList.remove('show');
  }, 3000);
}

/* =========================
   QUANTITY INPUT
========================= */
document.addEventListener('DOMContentLoaded', () => {
  const quantityInput = document.getElementById('orderQuantity');
  if (quantityInput) {
    quantityInput.addEventListener('input', updateOrderTotal);
  }
});

/* =========================
   INITIALIZATION
========================= */
function init() {
  updateHeader();
  renderPortfolio();
  renderMarkets();

  // Fetch live data
  fetchLiveMarketData();

  // Update every 10 seconds
  setInterval(fetchLiveMarketData, 10000);

  // Update UI every second
  setInterval(() => {
    updateHeader();
    updateUI();
  }, 1000);
}

// Start app
init();
