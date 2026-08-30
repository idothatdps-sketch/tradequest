"use strict";

/* =========================================================
   TRADEQUEST V1
   Komplett simulierte Trading-Lernplattform
   Kein echtes Geld
========================================================= */

const STORAGE_KEY = "tradequest_v1";

const ASSETS = {
  BTC: {
    symbol: "BTC",
    name: "Bitcoin",
    category: "crypto",
    icon: "₿",
    price: 103500,
    volatility: 0.0018
  },
  ETH: {
    symbol: "ETH",
    name: "Ethereum",
    category: "crypto",
    icon: "Ξ",
    price: 3860,
    volatility: 0.0022
  },
  SOL: {
    symbol: "SOL",
    name: "Solana",
    category: "crypto",
    icon: "S",
    price: 176,
    volatility: 0.003
  },
  AAPL: {
    symbol: "AAPL",
    name: "Apple",
    category: "stocks",
    icon: "A",
    price: 231,
    volatility: 0.0011
  },
  NVDA: {
    symbol: "NVDA",
    name: "NVIDIA",
    category: "stocks",
    icon: "N",
    price: 178,
    volatility: 0.0018
  },
  TSLA: {
    symbol: "TSLA",
    name: "Tesla",
    category: "stocks",
    icon: "T",
    price: 344,
    volatility: 0.0021
  },
  SPY: {
    symbol: "SPY",
    name: "S&P 500 ETF",
    category: "etf",
    icon: "S",
    price: 646,
    volatility: 0.0008
  },
  QQQ: {
    symbol: "QQQ",
    name: "Nasdaq ETF",
    category: "etf",
    icon: "Q",
    price: 575,
    volatility: 0.001
  }
};

const LESSONS = [
  {
    id: 1,
    title: "Trading-Grundlagen",
    icon: "🎓",
    description: "Verstehe Börsen, Assets, Kaufen und Verkaufen.",
    xp: 50,
    content: `
      <span class="eyebrow">LEVEL 1</span>
      <h2>Was ist Trading?</h2>
      <p>
        Trading bedeutet vereinfacht, dass du ein Finanzinstrument kaufst
        oder verkaufst, um von Preisbewegungen zu profitieren.
      </p>
      <p>
        In TradeQuest verwenden wir ausschließlich virtuelles Geld.
        Du kannst deshalb Fehler machen, ohne echtes Geld zu verlieren.
      </p>
      <ul>
        <li>Aktien sind Anteile an Unternehmen.</li>
        <li>Bitcoin ist eine Kryptowährung.</li>
        <li>Ein Chart zeigt die Entwicklung eines Preises.</li>
        <li>Eine Position ist ein offener Trade.</li>
      </ul>
    `,
    quiz: {
      question: "Was bedeutet eine Long-Position?",
      answers: [
        "Du erwartest steigende Kurse",
        "Du erwartest fallende Kurse",
        "Du besitzt kein Asset"
      ],
      correct: 0
    }
  },
  {
    id: 2,
    title: "Charts verstehen",
    icon: "📊",
    description: "Lerne Candlesticks, Trends, Support und Resistance.",
    xp: 75,
    content: `
      <span class="eyebrow">LEVEL 2</span>
      <h2>Charts lesen</h2>
      <p>
        Charts zeigen dir, wie sich ein Asset über einen bestimmten Zeitraum
        entwickelt hat.
      </p>
      <ul>
        <li>Grün bedeutet häufig steigende Kurse.</li>
        <li>Rot bedeutet häufig fallende Kurse.</li>
        <li>Ein Trend beschreibt die allgemeine Richtung.</li>
        <li>Support kann einen Bereich darstellen, an dem Käufer auftreten.</li>
        <li>Resistance kann einen Bereich darstellen, an dem Verkäufer auftreten.</li>
      </ul>
    `,
    quiz: {
      question: "Was beschreibt ein Aufwärtstrend?",
      answers: [
        "Tendenziell höhere Hochs und höhere Tiefs",
        "Nur fallende Kurse",
        "Keine Kursbewegung"
      ],
      correct: 0
    }
  },
  {
    id: 3,
    title: "Orders",
    icon: "⚡",
    description: "Market, Limit, Stop Loss und Take Profit.",
    xp: 100,
    content: `
      <span class="eyebrow">LEVEL 3</span>
      <h2>Orders verstehen</h2>
      <p>
        Eine Market Order wird zum verfügbaren simulierten Marktpreis ausgeführt.
      </p>
      <p>
        Eine Limit Order wird erst ausgeführt, wenn dein gewünschter Preis
        erreicht wird.
      </p>
      <p>
        Stop Loss und Take Profit helfen dabei, einen Trade nach vorher
        festgelegten Regeln zu schließen.
      </p>
    `,
    quiz: {
      question: "Was macht ein Stop Loss?",
      answers: [
        "Er kann einen Trade bei einem festgelegten Verlustniveau schließen",
        "Er garantiert Gewinn",
        "Er erhöht automatisch dein Kapital"
      ],
      correct: 0
    }
  },
  {
    id: 4,
    title: "Risikomanagement",
    icon: "🛡️",
    description: "Positionsgröße, Risiko pro Trade und Risk/Reward.",
    xp: 125,
    content: `
      <span class="eyebrow">LEVEL 4</span>
      <h2>Risiko kontrollieren</h2>
      <p>
        Gute Trader denken nicht nur darüber nach, wie viel sie gewinnen können,
        sondern auch darüber, wie viel sie verlieren könnten.
      </p>
      <ul>
        <li>Positionsgröße kontrollieren.</li>
        <li>Stop Loss sinnvoll einsetzen.</li>
        <li>Nicht das gesamte Kapital auf einen Trade setzen.</li>
        <li>Risk/Reward verstehen.</li>
        <li>Overtrading vermeiden.</li>
      </ul>
    `,
    quiz: {
      question: "Warum ist Risikomanagement wichtig?",
      answers: [
        "Damit einzelne Fehler nicht das gesamte Konto zerstören",
        "Damit jeder Trade Gewinn macht",
        "Damit man immer schneller tradet"
      ],
      correct: 0
    }
  },
  {
    id: 5,
    title: "Trading-Strategien",
    icon: "🧠",
    description: "Trend Following, Breakouts, DCA und Swing Trading.",
    xp: 150,
    content: `
      <span class="eyebrow">LEVEL 5</span>
      <h2>Strategien</h2>
      <p>
        Eine Strategie beschreibt Regeln dafür, wann du einen Trade eröffnest,
        wie du ihn verwaltest und wann du ihn beendest.
      </p>
      <ul>
        <li>Trend Following</li>
        <li>Breakout Trading</li>
        <li>Support/Resistance</li>
        <li>Moving Average</li>
        <li>DCA</li>
        <li>Swing Trading</li>
      </ul>
    `,
    quiz: {
      question: "Was ist DCA?",
      answers: [
        "Regelmäßiges Investieren eines festen Betrags",
        "Eine Order, die immer Gewinn macht",
        "Eine Form von Stop Loss"
      ],
      correct: 0
    }
  }
];

const MISSIONS = [
  {
    id: "first_trade",
    title: "Der erste Trade",
    description: "Führe deinen ersten simulierten Trade durch.",
    xp: 50
  },
  {
    id: "five_trades",
    title: "Routine aufbauen",
    description: "Führe insgesamt 5 Trades durch.",
    xp: 100
  },
  {
    id: "stop_loss",
    title: "Schutzschild",
    description: "Führe einen Trade mit Stop Loss durch.",
    xp: 100
  },
  {
    id: "limit_order",
    title: "Geduldiger Trader",
    description: "Erstelle eine Limit Order.",
    xp: 125
  },
  {
    id: "profit",
    title: "Erster Gewinn",
    description: "Schließe einen Trade mit positivem P&L ab.",
    xp: 150
  }
];

const ACHIEVEMENTS = [
  {
    id: "first",
    icon: "🚀",
    title: "Erster Trade",
    description: "Erster Trade abgeschlossen"
  },
  {
    id: "ten",
    icon: "🔥",
    title: "10 Trades",
    description: "10 Trades abgeschlossen"
  },
  {
    id: "profit",
    icon: "💰",
    title: "Erster Gewinn",
    description: "Ersten profitablen Trade"
  },
  {
    id: "risk",
    icon: "🛡️",
    title: "Risk Manager",
    description: "Stop Loss verwendet"
  },
  {
    id: "xp1000",
    icon: "⭐",
    title: "1000 XP",
    description: "1000 XP erreicht"
  },
  {
    id: "learner",
    icon: "🎓",
    title: "Student",
    description: "Erste Lektion abgeschlossen"
  },
  {
    id: "diverse",
    icon: "🌎",
    title: "Diversifiziert",
    description: "3 verschiedene Assets"
  },
  {
    id: "journal",
    icon: "📝",
    title: "Reflexion",
    description: "Ersten Journaleintrag erstellt"
  }
];

let state = loadState();

let currentPage = "home";
let selectedAsset = "BTC";
let orderSide = "buy";
let orderType = "market";
let currentFilter = "all";

const history = {};
const chartCanvas = document.getElementById("priceChart");
const ctx = chartCanvas.getContext("2d");

function defaultState() {
  return {
    cash: 10000,
    startingCash: 10000,
    positions: {},
    trades: [],
    realizedPnL: 0,
    xp: 0,
    completedLessons: [],
    completedMissions: [],
    achievements: [],
    journals: [],
    limitOrders: [],
    prices: Object.fromEntries(
      Object.entries(ASSETS).map(([symbol, asset]) => [symbol, asset.price])
    ),
    dayStartPrices: Object.fromEntries(
      Object.entries(ASSETS).map(([symbol, asset]) => [symbol, asset.price])
    )
  };
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return defaultState();

    const parsed = JSON.parse(saved);

    return {
      ...defaultState(),
      ...parsed
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function money(value) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR"
  }).format(value);
}

function number(value, digits = 2) {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  }).format(value);
}

function percent(value) {
  return `${value >= 0 ? "+" : ""}${number(value, 2)} %`;
}

function getPrice(symbol) {
  return state.prices[symbol];
}

function get24Change(symbol) {
  const start = state.dayStartPrices[symbol];
  return ((getPrice(symbol) - start) / start) * 100;
}

function getPositionValue() {
  return Object.entries(state.positions).reduce((sum, [symbol, pos]) => {
    return sum + pos.quantity * getPrice(symbol);
  }, 0);
}

function getUnrealizedPnL() {
  return Object.entries(state.positions).reduce((sum, [symbol, pos]) => {
    return sum + (getPrice(symbol) - pos.averagePrice) * pos.quantity;
  }, 0);
}

function getEquity() {
  return state.cash + getPositionValue();
}

function addXP(amount) {
  state.xp += amount;

  showToast(`+${amount} XP erhalten`, "success");

  checkAchievements();

  saveState();
  renderAll();
}

function getLevel() {
  return Math.floor(state.xp / 100) + 1;
}

function getLevelProgress() {
  return state.xp % 100;
}

/* =========================================================
   NAVIGATION
========================================================= */

function navigate(page) {
  currentPage = page;

  document.querySelectorAll(".page").forEach(p => {
    p.classList.remove("active");
  });

  const target = document.getElementById(`page-${page}`);

  if (target) target.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (page === "trade") {
    resizeChart();
    drawChart();
  }
}

document.addEventListener("click", e => {
  const pageButton = e.target.closest("[data-page]");

  if (pageButton) {
    navigate(pageButton.dataset.page);
  }
});

/* =========================================================
   SIMULATION ENGINE
========================================================= */

function simulateMarket() {
  Object.entries(ASSETS).forEach(([symbol, asset]) => {
    const oldPrice = state.prices[symbol];

    /*
      Kombination aus Random Walk und Momentum.
      Dadurch sieht der Markt weniger nach einer einfachen
      Zufallszahl aus.
    */

    const random = (Math.random() - 0.5) * 2;
    const momentum = Math.sin(Date.now() / 13000 + symbol.length) * 0.12;

    const movement =
      (random + momentum) *
      asset.volatility;

    let newPrice = oldPrice * (1 + movement);

    newPrice = Math.max(newPrice, oldPrice * 0.92);

    state.prices[symbol] = newPrice;

    if (history[symbol]) {
      history[symbol].push(newPrice);

      if (history[symbol].length > 160) {
        history[symbol].shift();
      }
    }

    checkLimitOrders(symbol);
    checkRiskOrders(symbol);
  });

  updateUI();

  if (currentPage === "trade") {
    drawChart();
  }

  saveState();
}

function initializeHistory() {
  Object.entries(ASSETS).forEach(([symbol, asset]) => {
    history[symbol] = [];

    let price = state.prices[symbol];

    for (let i = 0; i < 100; i++) {
      const movement =
        (Math.random() - 0.5) *
        asset.volatility *
        2;

      price *= 1 + movement;
      history[symbol].push(price);
    }

    history[symbol][history[symbol].length - 1] =
      state.prices[symbol];
  });
}

function checkLimitOrders(symbol) {
  const remaining = [];

  state.limitOrders.forEach(order => {
    if (order.symbol !== symbol) {
      remaining.push(order);
      return;
    }

    const price = getPrice(symbol);

    const triggered =
      order.side === "buy"
        ? price <= order.price
        : price >= order.price;

    if (triggered) {
      executeOrder({
        symbol: order.symbol,
        quantity: order.quantity,
        side: order.side,
        type: "limit",
        priceOverride: order.price,
        fromLimit: true
      });

      showToast(`Limit Order für ${symbol} ausgeführt`, "success");
    } else {
      remaining.push(order);
    }
  });

  state.limitOrders = remaining;
}

function checkRiskOrders(symbol) {
  const position = state.positions[symbol];

  if (!position) return;

  const price = getPrice(symbol);

  if (
    position.stopLoss &&
    price <= position.stopLoss
  ) {
    executeOrder({
      symbol,
      quantity: position.quantity,
      side: "sell",
      type: "stop",
      priceOverride: price,
      fromRisk: true
    });

    showToast(`Stop Loss für ${symbol} ausgelöst`, "error");

    return;
  }

  if (
    position.takeProfit &&
    price >= position.takeProfit
  ) {
    executeOrder({
      symbol,
      quantity: position.quantity,
      side: "sell",
      type: "take-profit",
      priceOverride: price,
      fromRisk: true
    });

    showToast(`Take Profit für ${symbol} ausgelöst`, "success");
  }
}

/* =========================================================
   TRADING ENGINE
========================================================= */

function executeOrder({
  symbol,
  quantity,
  side,
  type = "market",
  priceOverride = null,
  stopLoss = null,
  takeProfit = null,
  fromLimit = false,
  fromRisk = false
}) {
  quantity = Number(quantity);

  if (!quantity || quantity <= 0) {
    showToast("Bitte eine gültige Menge eingeben.", "error");
    return false;
  }

  const price =
    priceOverride !== null
      ? priceOverride
      : getPrice(symbol);

  const gross = quantity * price;
  const fee = gross * 0.001;

  if (side === "buy") {
    const total = gross + fee;

    if (total > state.cash) {
      showToast("Nicht genug virtuelles Guthaben.", "error");
      return false;
    }

    state.cash -= total;

    const existing = state.positions[symbol];

    if (existing) {
      const oldCost =
        existing.quantity * existing.averagePrice;

      const newCost = quantity * price;

      existing.quantity += quantity;

      existing.averagePrice =
        (oldCost + newCost) /
        existing.quantity;

      if (stopLoss !== null) {
        existing.stopLoss = Number(stopLoss);
      }

      if (takeProfit !== null) {
        existing.takeProfit = Number(takeProfit);
      }
    } else {
      state.positions[symbol] = {
        quantity,
        averagePrice: price,
        stopLoss:
          stopLoss !== null ? Number(stopLoss) : null,
        takeProfit:
          takeProfit !== null ? Number(takeProfit) : null
      };
    }

  } else {
    const position = state.positions[symbol];

    if (!position || position.quantity < quantity) {
      showToast("Nicht genug Bestand zum Verkaufen.", "error");
      return false;
    }

    const pnl =
      (price - position.averagePrice) *
      quantity;

    state.realizedPnL += pnl;

    state.cash += gross - fee;

    position.quantity -= quantity;

    if (position.quantity <= 0.00000001) {
      delete state.positions[symbol];
    }
  }

  state.trades.unshift({
    id: Date.now() + Math.random(),
    date: new Date().toISOString(),
    symbol,
    side,
    type,
    quantity,
    price,
    value: gross,
    fee,
    pnl:
      side === "sell"
        ? (price -
            (
              state.positions[symbol]?.averagePrice ||
              price
            )) * quantity
        : null
  });

  if (!fromLimit && !fromRisk) {
    addXP(10);
  }

  checkMissions();
  checkAchievements();

  saveState();
  renderAll();

  showToast(
    `${side === "buy" ? "Kauf" : "Verkauf"} ausgeführt: ${number(quantity, 6)} ${symbol}`,
    "success"
  );

  return true;
}

function submitOrder() {
  const symbol = document.getElementById("orderAsset").value;

  const quantity =
    Number(document.getElementById("orderQuantity").value);

  const stopLossValue =
    document.getElementById("stopLoss").value;

  const takeProfitValue =
    document.getElementById("takeProfit").value;

  const stopLoss =
    stopLossValue !== ""
      ? Number(stopLossValue)
      : null;

  const takeProfit =
    takeProfitValue !== ""
      ? Number(takeProfitValue)
      : null;

  if (orderType === "limit") {
    const limitPrice =
      Number(document.getElementById("limitPrice").value);

    if (!limitPrice || limitPrice <= 0) {
      showToast("Gib einen Limit-Preis ein.", "error");
      return;
    }

    if (!quantity || quantity <= 0) {
      showToast("Gib eine Menge ein.", "error");
      return;
    }

    state.limitOrders.push({
      id: Date.now(),
      symbol,
      quantity,
      side: orderSide,
      price: limitPrice
    });

    addXP(15);

    showToast("Limit Order erstellt.", "success");

    saveState();
    renderAll();
    return;
  }

  executeOrder({
    symbol,
    quantity,
    side: orderSide,
    type: orderType,
    stopLoss,
    takeProfit
  });
}

/* =========================================================
   RENDERING
========================================================= */

function renderAll() {
  updateUI();
  renderMarkets();
  renderHomeMarkets();
  renderTrade();
  renderPortfolio();
  renderHistory();
  renderCourses();
  renderMissions();
  renderAchievements();
  renderJournal();
}

function updateUI() {
  const equity = getEquity();
  const invested = getPositionValue();
  const totalChange = equity - state.startingCash;
  const totalChangePct =
    (totalChange / state.startingCash) * 100;

  document.getElementById("totalEquity").textContent =
    money(equity);

  document.getElementById("cashValue").textContent =
    money(state.cash);

  document.getElementById("investedValue").textContent =
    money(invested);

  document.getElementById("tradeCount").textContent =
    state.trades.length;

  const changeEl =
    document.getElementById("totalChange");

  changeEl.textContent =
    `${totalChange >= 0 ? "+" : ""}${money(totalChange)} · ${percent(totalChangePct)}`;

  changeEl.className =
    `change ${totalChange >= 0 ? "positive" : "negative"}`;

  const level = getLevel();
  const progress = getLevelProgress();

  document.getElementById("levelNumber").textContent =
    level;

  document.getElementById("xpText").textContent =
    `${progress} / 100 XP`;

  document.getElementById("xpBar").style.width =
    `${progress}%`;

  document.getElementById("academyXP").textContent =
    state.xp;

  const lessonProgress =
    Math.round(
      (state.completedLessons.length /
        LESSONS.length) *
        100
    );

  document.getElementById("homeLessonProgress").textContent =
    `${lessonProgress} % abgeschlossen`;

  document.getElementById("homeLearnBar").style.width =
    `${lessonProgress}%`;

  document.getElementById("portfolioEquity").textContent =
    money(equity);

  document.getElementById("portfolioCash").textContent =
    money(state.cash);

  document.getElementById("realizedPnL").textContent =
    money(state.realizedPnL);

  document.getElementById("unrealizedPnL").textContent =
    money(getUnrealizedPnL());
}

function renderHomeMarkets() {
  const container =
    document.getElementById("homeMarkets");

  container.innerHTML = Object.keys(ASSETS)
    .slice(0, 4)
    .map(symbol => marketCardHTML(symbol))
    .join("");
}

function marketCardHTML(symbol) {
  const asset = ASSETS[symbol];
  const price = getPrice(symbol);
  const change = get24Change(symbol);

  return `
    <div class="market-card" data-symbol="${symbol}">
      <div class="asset-top">
        <div class="asset-name">
          <div class="asset-icon">${asset.icon}</div>
          <div>
            <strong>${asset.name}</strong>
            <span>${asset.symbol}</span>
          </div>
        </div>
        <span class="${change >= 0 ? "positive" : "negative"}">
          ${change >= 0 ? "↗" : "↘"}
        </span>
      </div>

      <div class="market-price">${money(price)}</div>

      <div class="market-change ${change >= 0 ? "positive" : "negative"}">
        ${percent(change)}
      </div>
    </div>
  `;
}

function renderMarkets() {
  const tbody =
    document.getElementById("marketsTable");

  const search =
    document.getElementById("marketSearch").value
      .toLowerCase();

  tbody.innerHTML =
    Object.entries(ASSETS)
      .filter(([symbol, asset]) => {
        const matchesFilter =
          currentFilter === "all" ||
          asset.category === currentFilter;

        const matchesSearch =
          symbol.toLowerCase().includes(search) ||
          asset.name.toLowerCase().includes(search);

        return matchesFilter && matchesSearch;
      })
      .map(([symbol, asset]) => {
        const price = getPrice(symbol);
        const change = get24Change(symbol);

        return `
          <tr>
            <td>
              <div class="asset-name">
                <div class="asset-icon">${asset.icon}</div>
                <div>
                  <strong>${asset.name}</strong>
                  <span>${symbol}</span>
                </div>
              </div>
            </td>

            <td><strong>${money(price)}</strong></td>

            <td class="${change >= 0 ? "positive" : "negative"}">
              <strong>${percent(change)}</strong>
            </td>

            <td>
              <button
                class="secondary-btn"
                onclick="selectTradeAsset('${symbol}')">
                Traden
              </button>
            </td>
          </tr>
        `;
      })
      .join("");
}

function renderTrade() {
  const symbol = selectedAsset;
  const asset = ASSETS[symbol];
  const price = getPrice(symbol);
  const change = get24Change(symbol);

  document.getElementById("tradeAssetName").textContent =
    asset.name;

  document.getElementById("tradeAssetSymbol").textContent =
    symbol;

  document.getElementById("chartPrice").textContent =
    money(price);

  const chartChange =
    document.getElementById("chartChange");

  chartChange.textContent =
    percent(change);

  chartChange.className =
    change >= 0 ? "positive" : "negative";

  document.getElementById("quantitySymbol").textContent =
    symbol;

  document.getElementById("orderPrice").textContent =
    money(price);

  updateOrderSummary();

  document.getElementById("executeOrder").textContent =
    `${asset.name} ${orderSide === "buy" ? "kaufen" : "verkaufen"}`;

  document.getElementById("executeOrder").className =
    `trade-btn ${orderSide}`;

  document.getElementById("lastUpdate").textContent =
    `Update: ${new Date().toLocaleTimeString("de-DE")}`;
}

function updateOrderSummary() {
  const quantity =
    Number(document.getElementById("orderQuantity").value) || 0;

  const price = getPrice(selectedAsset);

  const gross = quantity * price;
  const fee = gross * 0.001;

  document.getElementById("orderAmount").textContent =
    `${number(quantity, 6)} ${selectedAsset}`;

  document.getElementById("orderFee").textContent =
    money(fee);

  document.getElementById("orderTotal").textContent =
    money(gross + fee);
}

function renderPortfolio() {
  const container =
    document.getElementById("positionsList");

  const positions =
    Object.entries(state.positions);

  if (!positions.length) {
    container.innerHTML = `
      <div class="empty-state">
        Noch keine offenen Positionen.<br>
        Gehe zum Trading-Terminal und führe deinen ersten Trade aus.
      </div>
    `;

    return;
  }

  container.innerHTML =
    positions.map(([symbol, pos]) => {
      const asset = ASSETS[symbol];
      const currentPrice = getPrice(symbol);
      const pnl =
        (currentPrice - pos.averagePrice) *
        pos.quantity;

      const pnlPct =
        ((currentPrice - pos.averagePrice) /
          pos.averagePrice) *
        100;

      return `
        <div class="position-card">
          <div>
            <span>ASSET</span>
            <strong>${asset.icon} ${asset.name} (${symbol})</strong>
          </div>

          <div>
            <span>MENGE</span>
            <strong>${number(pos.quantity, 6)}</strong>
          </div>

          <div>
            <span>EINSTIEG</span>
            <strong>${money(pos.averagePrice)}</strong>
          </div>

          <div>
            <span>P&L</span>
            <strong class="${pnl >= 0 ? "positive" : "negative"}">
              ${pnl >= 0 ? "+" : ""}${money(pnl)}
              <br>
              ${percent(pnlPct)}
            </strong>
          </div>

          <button
            class="secondary-btn"
            onclick="closePosition('${symbol}')">
            Schließen
          </button>
        </div>
      `;
    }).join("");
}

function renderHistory() {
  const tbody =
    document.getElementById("tradeHistory");

  if (!state.trades.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          Noch keine Trades.
        </td>
      </tr>
    `;

    return;
  }

  tbody.innerHTML =
    state.trades
      .slice(0, 100)
      .map(trade => {
        const pnl =
          trade.side === "sell"
            ? trade.pnl || 0
            : null;

        return `
          <tr>
            <td>${new Date(trade.date).toLocaleString("de-DE")}</td>
            <td><strong>${trade.symbol}</strong></td>
            <td class="${trade.side === "buy" ? "positive" : "negative"}">
              ${trade.side === "buy" ? "KAUF" : "VERKAUF"}
            </td>
            <td>${number(trade.quantity, 6)}</td>
            <td>${money(trade.price)}</td>
            <td>${money(trade.value)}</td>
            <td class="${pnl === null ? "" : pnl >= 0 ? "positive" : "negative"}">
              ${pnl === null ? "—" : `${pnl >= 0 ? "+" : ""}${money(pnl)}`}
            </td>
          </tr>
        `;
      })
      .join("");
}

function renderCourses() {
  const container =
    document.getElementById("courseGrid");

  container.innerHTML =
    LESSONS.map(lesson => {
      const completed =
        state.completedLessons.includes(lesson.id);

      return `
        <div class="course-card ${completed ? "completed" : ""}">
          <span class="course-number">
            LEVEL ${lesson.id}
          </span>

          <h2>${lesson.icon} ${lesson.title}</h2>

          <p>${lesson.description}</p>

          <div class="course-meta">
            <span>⭐ ${lesson.xp} XP</span>
            <span>${completed ? "✓ Abgeschlossen" : "Noch offen"}</span>
          </div>

          <button
            class="${completed ? "secondary-btn" : "primary-btn"}"
            onclick="openLesson(${lesson.id})">
            ${completed ? "Wiederholen" : "Lektion starten"}
          </button>
        </div>
      `;
    }).join("");
}

function renderMissions() {
  const container =
    document.getElementById("missionList");

  container.innerHTML =
    MISSIONS.map((mission, index) => {
      const completed =
        state.completedMissions.includes(mission.id);

      return `
        <div class="mission-card ${completed ? "completed" : ""}">
          <div class="mission-number">
            ${completed ? "✓" : index + 1}
          </div>

          <div>
            <h3>${mission.title}</h3>
            <p>${mission.description}</p>
          </div>

          <div class="mission-xp">
            +${mission.xp} XP
          </div>
        </div>
      `;
    }).join("");
}

function renderAchievements() {
  const container =
    document.getElementById("achievementGrid");

  container.innerHTML =
    ACHIEVEMENTS.map(a => {
      const unlocked =
        state.achievements.includes(a.id);

      return `
        <div class="achievement ${unlocked ? "unlocked" : ""}">
          <div class="achievement-icon">${a.icon}</div>
          <strong>${a.title}</strong>
          <span>${a.description}</span>
        </div>
      `;
    }).join("");
}

function renderJournal() {
  const container =
    document.getElementById("journalList");

  if (!state.journals.length) {
    container.innerHTML = `
      <div class="empty-state">
        Dein Trading-Journal ist noch leer.
      </div>
    `;

    return;
  }

  container.innerHTML =
    state.journals.map(entry => `
      <div class="journal-entry">
        <div class="journal-entry-top">
          <strong>${entry.symbol} · ${entry.emotion}</strong>
          <small>${new Date(entry.date).toLocaleString("de-DE")}</small>
        </div>

        <p>${escapeHTML(entry.text)}</p>
      </div>
    `).join("");
}

/* =========================================================
   LESSONS
========================================================= */

function openLesson(id) {
  const lesson =
    LESSONS.find(l => l.id === id);

  if (!lesson) return;

  const modal =
    document.getElementById("lessonModal");

  const content =
    document.getElementById("lessonContent");

  content.innerHTML = `
    <div class="lesson-content">
      ${lesson.content}

      <div style="margin-top:30px">
        <span class="eyebrow">QUIZ</span>
        <h3 style="margin:8px 0 15px">
          ${lesson.quiz.question}
        </h3>

        ${lesson.quiz.answers.map((answer, index) => `
          <button
            class="quiz-option"
            onclick="answerQuiz(${lesson.id}, ${index})">
            ${answer}
          </button>
        `).join("")}
      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function answerQuiz(lessonId, answer) {
  const lesson =
    LESSONS.find(l => l.id === lessonId);

  if (answer !== lesson.quiz.correct) {
    showToast("Noch nicht richtig. Versuch es erneut.", "error");
    return;
  }

  if (!state.completedLessons.includes(lessonId)) {
    state.completedLessons.push(lessonId);
    state.xp += lesson.xp;
  }

  checkAchievements();
  saveState();

  document.getElementById("lessonContent").innerHTML = `
    <div class="lesson-content">
      <div style="font-size:50px">🎉</div>
      <h2>Sehr gut!</h2>
      <p>
        Du hast die Lektion erfolgreich abgeschlossen.
      </p>
      <p>
        <strong>+${lesson.xp} XP</strong>
      </p>
      <button
        class="primary-btn"
        onclick="closeLesson()">
        Weiter
      </button>
    </div>
  `;

  renderAll();
}

function closeLesson() {
  document.getElementById("lessonModal")
    .classList.add("hidden");
}

/* =========================================================
   MISSIONS & ACHIEVEMENTS
========================================================= */

function completeMission(id, xp) {
  if (state.completedMissions.includes(id)) {
    return;
  }

  state.completedMissions.push(id);
  state.xp += xp;

  showToast(`Mission abgeschlossen! +${xp} XP`, "success");

  saveState();
}

function checkMissions() {
  if (
    state.trades.length >= 1
  ) {
    completeMission("first_trade", 50);
  }

  if (
    state.trades.length >= 5
  ) {
    completeMission("five_trades", 100);
  }

  if (
    state.trades.some(
      trade =>
        trade.type === "stop"
    )
  ) {
    completeMission("stop_loss", 100);
  }

  if (
    state.trades.some(
      trade =>
        trade.type === "limit"
    )
  ) {
    completeMission("limit_order", 125);
  }

  if (
    state.trades.some(
      trade =>
        trade.side === "sell" &&
        (trade.pnl || 0) > 0
    )
  ) {
    completeMission("profit", 150);
  }
}

function unlockAchievement(id) {
  if (state.achievements.includes(id)) {
    return;
  }

  state.achievements.push(id);

  showToast("🏆 Achievement freigeschaltet!", "success");

  saveState();
}

function checkAchievements() {
  if (state.trades.length >= 1) {
    unlockAchievement("first");
  }

  if (state.trades.length >= 10) {
    unlockAchievement("ten");
  }

  if (
    state.trades.some(
      trade =>
        trade.side === "sell" &&
        (trade.pnl || 0) > 0
    )
  ) {
    unlockAchievement("profit");
  }

  if (
    state.trades.some(
      trade =>
        trade.type === "stop"
    )
  ) {
    unlockAchievement("risk");
  }

  if (state.xp >= 1000) {
    unlockAchievement("xp1000");
  }

  if (state.completedLessons.length >= 1) {
    unlockAchievement("learner");
  }

  if (
    Object.keys(state.positions).length >= 3
  ) {
    unlockAchievement("diverse");
  }

  if (state.journals.length >= 1) {
    unlockAchievement("journal");
  }
}

/* =========================================================
   CHART
========================================================= */

function resizeChart() {
  const rect =
    chartCanvas.getBoundingClientRect();

  const dpr =
    window.devicePixelRatio || 1;

  chartCanvas.width =
    rect.width * dpr;

  chartCanvas.height =
    rect.height * dpr;

  ctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}

function drawChart() {
  if (!chartCanvas) return;

  const rect =
    chartCanvas.getBoundingClientRect();

  const width = rect.width;
  const height = rect.height;

  if (!width || !height) return;

  ctx.clearRect(0, 0, width, height);

  const values =
    history[selectedAsset] || [];

  if (values.length < 2) return;

  const min =
    Math.min(...values);

  const max =
    Math.max(...values);

  const range =
    max - min || 1;

  /* Grid */

  ctx.strokeStyle = "#18202c";
  ctx.lineWidth = 1;

  for (let i = 1; i < 6; i++) {
    const y =
      (height / 6) * i;

    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for (let i = 1; i < 8; i++) {
    const x =
      (width / 8) * i;

    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  /* Price line */

  ctx.beginPath();

  values.forEach((value, index) => {
    const x =
      (index /
        (values.length - 1)) *
      width;

    const y =
      height -
      ((value - min) / range) *
        (height - 30) -
      15;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  const first =
    values[0];

  const last =
    values[values.length - 1];

  ctx.strokeStyle =
    last >= first
      ? "#27d17f"
      : "#ff5d6c";

  ctx.lineWidth = 2;
  ctx.stroke();

  /* Current price */

  const lastY =
    height -
    ((last - min) / range) *
      (height - 30) -
    15;

  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = "#4b5668";

  ctx.beginPath();
  ctx.moveTo(0, lastY);
  ctx.lineTo(width, lastY);
  ctx.stroke();

  ctx.setLineDash([]);

  ctx.fillStyle = "#f5f7fa";
  ctx.font = "11px Inter, sans-serif";

  ctx.fillText(
    money(last),
    10,
    Math.max(15, lastY - 7)
  );
}

window.addEventListener("resize", () => {
  resizeChart();
  drawChart();
});

/* =========================================================
   ASSET SELECTION
========================================================= */

function populateAssetSelects() {
  const selects = [
    document.getElementById("tradeAsset"),
    document.getElementById("orderAsset"),
    document.getElementById("journalAsset")
  ];

  selects.forEach(select => {
    if (!select) return;

    select.innerHTML =
      Object.entries(ASSETS)
        .map(([symbol, asset]) => `
          <option value="${symbol}">
            ${asset.name} (${symbol})
          </option>
        `)
        .join("");

    select.value = selectedAsset;
  });
}

function selectTradeAsset(symbol) {
  selectedAsset = symbol;

  document.getElementById("orderAsset").value =
    symbol;

  navigate("trade");

  renderTrade();
  drawChart();
}

document.getElementById("tradeAsset")
  .addEventListener("change", e => {
    selectedAsset = e.target.value;

    document.getElementById("orderAsset").value =
      selectedAsset;

    renderTrade();
    drawChart();
  });

document.getElementById("orderAsset")
  .addEventListener("change", e => {
    selectedAsset = e.target.value;

    document.getElementById("tradeAsset").value =
      selectedAsset;

    renderTrade();
    drawChart();
  });

/* =========================================================
   ORDER UI
========================================================= */

document.querySelectorAll(".order-side")
  .forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".order-side")
        .forEach(b => b.classList.remove("active"));

      button.classList.add("active");

      orderSide = button.dataset.side;

      renderTrade();
    });
  });

document.querySelectorAll(".order-type")
  .forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".order-type")
        .forEach(b => b.classList.remove("active"));

      button.classList.add("active");

      orderType = button.dataset.order;

      document.getElementById("limitPriceRow")
        .classList.toggle(
          "hidden",
          orderType !== "limit"
        );

      renderTrade();
    });
  });

document.getElementById("orderQuantity")
  .addEventListener("input", updateOrderSummary);

document.getElementById("executeOrder")
  .addEventListener("click", submitOrder);

document.querySelectorAll(".quick-percent")
  .forEach(() => {});

document.querySelectorAll(".quick-percent button")
  .forEach(button => {
    button.addEventListener("click", () => {
      const pct =
        Number(button.dataset.percent) / 100;

      const price =
        getPrice(selectedAsset);

      let available;

      if (orderSide === "buy") {
        available =
          state.cash / 1.001;
      } else {
        available =
          state.positions[selectedAsset]?.quantity || 0;
      }

      const quantity =
        (available * pct);

      document.getElementById("orderQuantity").value =
        quantity;

      updateOrderSummary();
    });
  });

/* =========================================================
   MARKET FILTER
========================================================= */

document.querySelectorAll(".filter")
  .forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter")
        .forEach(b => b.classList.remove("active"));

      button.classList.add("active");

      currentFilter =
        button.dataset.filter;

      renderMarkets();
    });
  });

document.getElementById("marketSearch")
  .addEventListener("input", renderMarkets);

/* =========================================================
   CHART PERIODS
========================================================= */

document.querySelectorAll(".chart-period")
  .forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".chart-period")
        .forEach(b => b.classList.remove("active"));

      button.classList.add("active");

      /*
        V1 nutzt dieselbe Simulation.
        In einer späteren Version werden hier
        echte historische Zeitreihen geladen.
      */

      drawChart();
    });
  });

/* =========================================================
   JOURNAL
========================================================= */

document.getElementById("saveJournal")
  .addEventListener("click", () => {
    const symbol =
      document.getElementById("journalAsset").value;

    const text =
      document.getElementById("journalText").value.trim();

    const emotion =
      document.getElementById("journalEmotion").value;

    if (!text) {
      showToast("Schreib zuerst deine Trading-Idee.", "error");
      return;
    }

    state.journals.unshift({
      id: Date.now(),
      date: new Date().toISOString(),
      symbol,
      text,
      emotion
    });

    document.getElementById("journalText").value = "";

    addXP(15);

    showToast("Journaleintrag gespeichert.", "success");

    saveState();
    renderAll();
  });

/* =========================================================
   POSITION SCHLIESSEN
========================================================= */

function closePosition(symbol) {
  const position =
    state.positions[symbol];

  if (!position) return;

  executeOrder({
    symbol,
    quantity: position.quantity,
    side: "sell",
    type: "market"
  });
}

/* =========================================================
   RESET
========================================================= */

document.getElementById("resetBtn")
  .addEventListener("click", () => {
    const confirmed =
      confirm(
        "Möchtest du deine komplette TradeQuest-Simulation zurücksetzen?"
      );

    if (!confirmed) return;

    state = defaultState();

    initializeHistory();
    populateAssetSelects();
    renderAll();

    showToast("Simulation wurde zurückgesetzt.", "success");
  });

/* =========================================================
   TOAST
========================================================= */

function showToast(message, type = "") {
  const container =
    document.getElementById("toastContainer");

  const toast =
    document.createElement("div");

  toast.className =
    `toast ${type}`;

  toast.textContent =
    message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2800);
}

/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =========================================================
   INITIALIZATION
========================================================= */

populateAssetSelects();

initializeHistory();

renderAll();

resizeChart();

drawChart();

/*
  Marktupdate:
  Jede Sekunde.
*/

setInterval(simulateMarket, 1000);

/*
  Alle 10 Sekunden zusätzlich prüfen.
*/

setInterval(() => {
  checkMissions();
  checkAchievements();
  saveState();
  renderAll();
}, 10000);

console.log(
  "%cTradeQuest V1 gestartet",
  "font-size:18px;font-weight:bold"
);

console.log(
  "Simulation only — kein echtes Geld."
);