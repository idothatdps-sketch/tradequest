"use strict";

/* =====================================================
   TRADEQUEST
   Vollständige Trading-Lern-Simulation
   Kein Echtgeld
===================================================== */


/* =========================
   ASSETS
========================= */

const ASSETS = {

  BTC: {
    name: "Bitcoin",
    symbol: "BTC",
    icon: "₿",
    type: "crypto",
    price: 62000,
    vol: 0.0022
  },

  ETH: {
    name: "Ethereum",
    symbol: "ETH",
    icon: "Ξ",
    type: "crypto",
    price: 2800,
    vol: 0.0028
  },

  SOL: {
    name: "Solana",
    symbol: "SOL",
    icon: "S",
    type: "crypto",
    price: 145,
    vol: 0.004
  },

  XRP: {
    name: "XRP",
    symbol: "XRP",
    icon: "X",
    type: "crypto",
    price: 2.65,
    vol: 0.0035
  },

  AAPL: {
    name: "Apple",
    symbol: "AAPL",
    icon: "A",
    type: "stocks",
    price: 229,
    vol: 0.0014
  },

  NVDA: {
    name: "NVIDIA",
    symbol: "NVDA",
    icon: "N",
    type: "stocks",
    price: 177,
    vol: 0.002
  },

  TSLA: {
    name: "Tesla",
    symbol: "TSLA",
    icon: "T",
    type: "stocks",
    price: 335,
    vol: 0.0025
  },

  MSFT: {
    name: "Microsoft",
    symbol: "MSFT",
    icon: "M",
    type: "stocks",
    price: 505,
    vol: 0.0012
  },

  SPY: {
    name: "S&P 500 ETF",
    symbol: "SPY",
    icon: "E",
    type: "etf",
    price: 646,
    vol: 0.001
  },

  QQQ: {
    name: "Nasdaq 100 ETF",
    symbol: "QQQ",
    icon: "Q",
    type: "etf",
    price: 575,
    vol: 0.0012
  },

  EURUSD: {
    name: "Euro / US Dollar",
    symbol: "EURUSD",
    icon: "€",
    type: "forex",
    price: 1.17,
    vol: 0.0008
  },

  GOLD: {
    name: "Gold",
    symbol: "XAU",
    icon: "Au",
    type: "commodity",
    price: 3370,
    vol: 0.0008
  }

};


/* =========================
   LESSONS
========================= */

const LESSONS = [

  {
    id: "l1",
    title: "Trading-Grundlagen",
    text: "Lerne Assets, Börsen, Broker und grundlegende Trading-Begriffe.",
    question: "Was ist eine Market Order?",
    answers: [
      "Eine Order zum aktuell verfügbaren Marktpreis.",
      "Eine Order, die immer erst morgen ausgeführt wird.",
      "Ein Sparplan."
    ],
    correct: 0
  },

  {
    id: "l2",
    title: "Candlesticks lesen",
    text: "Verstehe Open, High, Low und Close.",
    question: "Was zeigt eine grüne Kerze normalerweise?",
    answers: [
      "Der Schlusskurs liegt über dem Eröffnungskurs.",
      "Der Markt war geschlossen.",
      "Es gab keine Trades."
    ],
    correct: 0
  },

  {
    id: "l3",
    title: "Orders verstehen",
    text: "Market, Limit und Stop Orders.",
    question: "Wofür wird ein Stop Loss genutzt?",
    answers: [
      "Um Verluste zu begrenzen.",
      "Um garantiert Gewinn zu machen.",
      "Um Gebühren zu vermeiden."
    ],
    correct: 0
  },

  {
    id: "l4",
    title: "Risiko-Management",
    text: "Positionsgröße, Risiko pro Trade und Diversifikation.",
    question: "Was ist normalerweise sinnvoll?",
    answers: [
      "Das gesamte Konto auf einen Trade setzen.",
      "Das Risiko pro Trade begrenzen.",
      "Stop Loss nie verwenden."
    ],
    correct: 1
  },

  {
    id: "l5",
    title: "Trading-Strategien",
    text: "Trend Following, Breakout, DCA und Swing Trading.",
    question: "Was bedeutet DCA?",
    answers: [
      "Regelmäßig investieren.",
      "Nur am Tageshoch kaufen.",
      "Immer Short gehen."
    ],
    correct: 0
  },

  {
    id: "l6",
    title: "Trading-Journal",
    text: "Dokumentiere deine Entscheidungen und analysiere deine Trades.",
    question: "Warum ist ein Trading-Journal sinnvoll?",
    answers: [
      "Um Entscheidungen zu reflektieren.",
      "Um Gewinne zu garantieren.",
      "Um Gebühren zu vermeiden."
    ],
    correct: 0
  }

];


/* =========================
   MISSIONEN
========================= */

const MISSIONS = [

  {
    id: "firstTrade",
    title: "Erster Trade",
    text: "Führe deinen ersten simulierten Trade aus.",
    xp: 50,
    check: () => STATE.trades.length >= 1
  },

  {
    id: "firstLesson",
    title: "Lernstarter",
    text: "Schließe deine erste Lektion ab.",
    xp: 30,
    check: () => STATE.lessons.length >= 1
  },

  {
    id: "tenTrades",
    title: "10 Trades",
    text: "Führe zehn simulierte Trades aus.",
    xp: 100,
    check: () => STATE.trades.length >= 10
  },

  {
    id: "risk",
    title: "Risikoprofi",
    text: "Erstelle eine Stop-Order.",
    xp: 100,
    check: () => STATE.riskOrders >= 1
  },

  {
    id: "level5",
    title: "Level 5",
    text: "Erreiche Level 5.",
    xp: 200,
    check: () => getLevel() >= 5
  }

];


/* =========================
   ACHIEVEMENTS
========================= */

const ACHIEVEMENTS = [

  {
    id: "first",
    icon: "🥇",
    title: "Erster Trade",
    check: () => STATE.trades.length >= 1
  },

  {
    id: "ten",
    icon: "🔥",
    title: "10 Trades",
    check: () => STATE.trades.length >= 10
  },

  {
    id: "lesson",
    icon: "📚",
    title: "Erste Lektion",
    check: () => STATE.lessons.length >= 1
  },

  {
    id: "risk",
    icon: "🛡️",
    title: "Risikoprofi",
    check: () => STATE.riskOrders >= 1
  },

  {
    id: "level5",
    icon: "⭐",
    title: "Level 5",
    check: () => getLevel() >= 5
  },

  {
    id: "journal",
    icon: "📓",
    title: "Journalist",
    check: () => STATE.journal.length >= 3
  }

];


/* =========================
   STATE
========================= */

const STORAGE_KEY =
  "tradequest_complete_v1";

function defaultState() {

  return {

    cash: 10000,

    startCash: 10000,

    positions: {},

    trades: [],

    orders: [],

    lessons: [],

    missions: [],

    journal: [],

    achievements: [],

    xp: 0,

    riskOrders: 0,

    selectedAsset: "BTC",

    side: "buy",

    orderType: "market",

    filter: "all",

    search: ""

  };

}


let STATE;

try {

  STATE =
    JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    ) ||
    defaultState();

} catch {

  STATE =
    defaultState();

}


/* =========================
   PRICES
========================= */

const PRICES = {};
const HISTORY = {};

Object.entries(ASSETS).forEach(
  ([symbol, asset]) => {

    PRICES[symbol] =
      asset.price;

    HISTORY[symbol] = [];

    for (
      let i = 0;
      i < 120;
      i++
    ) {

      HISTORY[symbol].push(
        asset.price *
        (
          1 +
          (
            Math.random() -
            0.5
          ) *
          0.04
        )
      );

    }

  }
);


/* =========================
   HELPERS
========================= */

function save() {

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(STATE)
  );

}


function getLevel() {

  return (
    Math.floor(
      STATE.xp / 100
    ) + 1
  );

}


function getProgress() {

  return STATE.xp % 100;

}


function money(value) {

  return new Intl.NumberFormat(
    "de-DE",
    {
      style: "currency",
      currency: "EUR"
    }
  ).format(value);

}


function num(value) {

  return Number(value).toLocaleString(
    "de-DE",
    {
      maximumFractionDigits: 8
    }
  );

}


function pct(value) {

  return (
    value >= 0
      ? "+"
      : ""
  ) +
  value.toFixed(2) +
  "%";

}


function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent =
    message;

  toast.classList.add("show");

  clearTimeout(
    showToast.timer
  );

  showToast.timer =
    setTimeout(
      () => {
        toast.classList.remove(
          "show"
        );
      },
      2200
    );

}


/* =========================
   PORTFOLIO CALCULATIONS
========================= */

function investedValue() {

  let value = 0;

  Object.entries(
    STATE.positions
  ).forEach(
    ([symbol, position]) => {

      value +=
        Math.abs(
          position.quantity
        ) *
        PRICES[symbol];

    }
  );

  return value;

}


function portfolioValue() {

  return (
    STATE.cash +
    investedValue()
  );

}


function totalProfit() {

  return (
    portfolioValue() -
    STATE.startCash
  );

}


/* =========================
   NAVIGATION
========================= */

function openPage(page) {

  document
    .querySelectorAll(".page")
    .forEach(
      element => {

        element.classList.remove(
          "active"
        );

      }
    );

  const target =
    document.getElementById(
      `page-${page}`
    );

  if (target) {

    target.classList.add(
      "active"
    );

  }

  document
    .querySelectorAll(
      ".nav-item"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.page ===
          page
        );

      }
    );

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* =========================
   POSITION
========================= */

function changePosition(
  symbol,
  quantity,
  price,
  direction
) {

  const old =
    STATE.positions[symbol];

  if (!old) {

    STATE.positions[symbol] = {

      quantity:
        quantity * direction,

      entry:
        price,

      stopLoss:
        null,

      takeProfit:
        null

    };

    return;

  }


  if (
    Math.sign(
      old.quantity
    ) === direction
  ) {

    const oldQty =
      Math.abs(
        old.quantity
      );

    old.entry =
      (
        oldQty * old.entry +
        quantity * price
      ) /
      (
        oldQty + quantity
      );

    old.quantity +=
      quantity * direction;

  } else {

    old.quantity +=
      quantity * direction;

    if (
      Math.abs(
        old.quantity
      ) < 0.0000001
    ) {

      delete STATE.positions[symbol];

    }

  }

}


/* =========================
   EXECUTE MARKET TRADE
========================= */

function executeMarketTrade() {

  const symbol =
    STATE.selectedAsset;

  const quantity =
    Number(
      document.getElementById(
        "tradeQuantity"
      ).value
    );

  if (
    !quantity ||
    quantity <= 0
  ) {

    showToast(
      "Bitte eine gültige Menge eingeben."
    );

    return;

  }


  const price =
    PRICES[symbol];

  const value =
    quantity * price;

  const fee =
    value * 0.001;


  if (
    STATE.side === "buy"
  ) {

    if (
      STATE.cash <
      value + fee
    ) {

      showToast(
        "Nicht genug virtuelles Guthaben."
      );

      return;

    }

    STATE.cash -=
      value + fee;

    changePosition(
      symbol,
      quantity,
      price,
      1
    );

  } else {

    STATE.cash +=
      value - fee;

    changePosition(
      symbol,
      quantity,
      price,
      -1
    );

  }


  STATE.trades.unshift({

    id:
      Date.now(),

    symbol,

    side:
      STATE.side,

    quantity,

    price,

    value,

    fee,

    time:
      Date.now()

  });


  STATE.xp += 10;

  checkMissions();

  save();

  renderAll();

  showToast(
    STATE.side === "buy"
      ? "Kauf ausgeführt ✓"
      : "Verkauf ausgeführt ✓"
  );

}


/* =========================
   CREATE LIMIT / STOP
========================= */

function createOrder() {

  const symbol =
    STATE.selectedAsset;

  const quantity =
    Number(
      document.getElementById(
        "tradeQuantity"
      ).value
    );

  const trigger =
    Number(
      document.getElementById(
        "tradePriceInput"
      ).value
    );


  if (
    !quantity ||
    quantity <= 0
  ) {

    showToast(
      "Bitte eine Menge eingeben."
    );

    return;

  }


  if (
    !trigger ||
    trigger <= 0
  ) {

    showToast(
      "Bitte einen Trigger-Preis eingeben."
    );

    return;

  }


  STATE.orders.push({

    id:
      Date.now(),

    symbol,

    side:
      STATE.side,

    type:
      STATE.orderType,

    quantity,

    trigger,

    time:
      Date.now()

  });


  if (
    STATE.orderType ===
    "stop"
  ) {

    STATE.riskOrders++;

  }


  STATE.xp += 5;

  checkMissions();

  save();

  renderAll();

  showToast(
    `${STATE.orderType.toUpperCase()}-Order erstellt`
  );

}


/* =========================
   CHECK ORDERS
========================= */

function checkOrders() {

  const remaining = [];

  STATE.orders.forEach(
    order => {

      const price =
        PRICES[
          order.symbol
        ];

      let trigger =
        false;


      if (
        order.type ===
        "limit"
      ) {

        if (
          order.side === "buy" &&
          price <= order.trigger
        ) {

          trigger = true;

        }

        if (
          order.side === "sell" &&
          price >= order.trigger
        ) {

          trigger = true;

        }

      }


      if (
        order.type ===
        "stop"
      ) {

        if (
          order.side === "buy" &&
          price >= order.trigger
        ) {

          trigger = true;

        }

        if (
          order.side === "sell" &&
          price <= order.trigger
        ) {

          trigger = true;

        }

      }


      if (trigger) {

        executeAutomaticOrder(
          order,
          price
        );

      } else {

        remaining.push(
          order
        );

      }

    }
  );


  STATE.orders =
    remaining;

}


function executeAutomaticOrder(
  order,
  price
) {

  const value =
    order.quantity *
    price;

  const fee =
    value * 0.001;


  if (
    order.side === "buy"
  ) {

    if (
      STATE.cash >=
      value + fee
    ) {

      STATE.cash -=
        value + fee;

      changePosition(
        order.symbol,
        order.quantity,
        price,
        1
      );

    }

  } else {

    STATE.cash +=
      value - fee;

    changePosition(
      order.symbol,
      order.quantity,
      price,
      -1
    );

  }


  STATE.trades.unshift({

    id:
      Date.now(),

    symbol:
      order.symbol,

    side:
      order.side,

    quantity:
      order.quantity,

    price,

    value,

    fee,

    time:
      Date.now()

  });


  STATE.xp += 5;

  save();

  showToast(
    "Deine Order wurde ausgeführt!"
  );

}


/* =========================
   MARKET SIMULATION
========================= */

function updateMarkets() {

  Object.entries(
    ASSETS
  ).forEach(
    ([symbol, asset]) => {

      const movement =
        (
          Math.random() -
          0.5
        ) *
        asset.vol;

      PRICES[symbol] =
        Math.max(
          0.0001,
          PRICES[symbol] *
          (
            1 +
            movement
          )
        );


      HISTORY[symbol].push(
        PRICES[symbol]
      );


      if (
        HISTORY[symbol].length >
        120
      ) {

        HISTORY[symbol].shift();

      }

    }
  );


  checkOrders();

  renderMarketPrices();

  renderHome();

  renderPortfolio();

  renderTrade();

  drawChart();

}


/* =========================
   MARKET RENDER
========================= */

function marketChange(
  symbol
) {

  const history =
    HISTORY[symbol];

  const old =
    history[
      Math.max(
        0,
        history.length - 20
      )
    ];

  return (
    PRICES[symbol] /
    old -
    1
  ) * 100;

}


function marketHTML(
  symbol
) {

  const asset =
    ASSETS[symbol];

  const change =
    marketChange(symbol);

  return `

    <button
      class="market-item"
      data-asset="${symbol}"
    >

      <span class="market-icon">
        ${asset.icon}
      </span>

      <span class="market-name">

        <strong>
          ${asset.name}
        </strong>

        <small>
          ${asset.symbol}
        </small>

      </span>

      <span class="market-price">

        <strong>
          ${money(PRICES[symbol])}
        </strong>

        <small
          class="${
            change >= 0
              ? "positive"
              : "negative"
          }"
        >
          ${pct(change)}
        </small>

      </span>

    </button>

  `;

}


function renderMarkets() {

  const container =
    document.getElementById(
      "marketList"
    );

  if (!container)
    return;


  const search =
    STATE.search.toLowerCase();


  const symbols =
    Object.keys(
      ASSETS
    ).filter(
      symbol => {

        const asset =
          ASSETS[symbol];

        const matchesFilter =
          STATE.filter === "all" ||
          asset.type === STATE.filter;

        const matchesSearch =
          asset.name
            .toLowerCase()
            .includes(search) ||
          symbol
            .toLowerCase()
            .includes(search);

        return (
          matchesFilter &&
          matchesSearch
        );

      }
    );


  container.innerHTML =
    symbols
      .map(marketHTML)
      .join("");

}


function renderHomeMarkets() {

  const container =
    document.getElementById(
      "homeMarkets"
    );

  if (!container)
    return;


  container.innerHTML =
    [
      "BTC",
      "ETH",
      "NVDA",
      "AAPL"
    ]
    .map(marketHTML)
    .join("");

}


/* =========================
   TRADE PAGE
========================= */

function renderTrade() {

  const symbol =
    STATE.selectedAsset;

  const asset =
    ASSETS[symbol];

  const price =
    PRICES[symbol];

  const change =
    marketChange(symbol);


  document.getElementById(
    "selectedAsset"
  ).textContent =
    asset.name;


  document.getElementById(
    "selectedSymbol"
  ).textContent =
    asset.symbol;


  document.getElementById(
    "tradeAssetIcon"
  ).textContent =
    asset.icon;


  document.getElementById(
    "selectedPrice"
  ).textContent =
    money(price);


  const changeElement =
    document.getElementById(
      "selectedChange"
    );

  changeElement.textContent =
    pct(change);

  changeElement.className =
    change >= 0
      ? "positive"
      : "negative";


  document.getElementById(
    "quantitySymbol"
  ).textContent =
    asset.symbol;


  document.getElementById(
    "tradePriceSummary"
  ).textContent =
    money(price);


  document.getElementById(
    "tradeCash"
  ).textContent =
    money(STATE.cash);


  const quantity =
    Number(
      document.getElementById(
        "tradeQuantity"
      ).value
    ) || 0;


  document.getElementById(
    "tradeFee"
  ).textContent =
    money(
      quantity *
      price *
      0.001
    );


  document
    .querySelectorAll(
      ".trade-side"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.side ===
          STATE.side
        );

      }
    );


  document
    .querySelectorAll(
      ".order-type"
    )
    .forEach(
      button => {

        button.classList.toggle(
          "active",
          button.dataset.order ===
          STATE.orderType
        );

      }
    );


  const execute =
    document.getElementById(
      "executeTrade"
    );


  if (
    STATE.orderType ===
    "market"
  ) {

    execute.textContent =
      asset.name +
      (
        STATE.side === "buy"
          ? " kaufen"
          : " verkaufen"
      );

  } else {

    execute.textContent =
      "Order erstellen";

  }

}


/* =========================
   PORTFOLIO
========================= */

function renderPortfolio() {

  const total =
    portfolioValue();

  const profit =
    totalProfit();

  const percentage =
    (
      profit /
      STATE.startCash
    ) * 100;


  document.getElementById(
    "portfolioTotal"
  ).textContent =
    money(total);


  document.getElementById(
    "portfolioCash"
  ).textContent =
    money(STATE.cash);


  document.getElementById(
    "portfolioProfit"
  ).textContent =
    money(profit);


  document.getElementById(
    "portfolioPercent"
  ).textContent =
    pct(percentage);


  document.getElementById(
    "investedValue"
  ).textContent =
    money(
      investedValue()
    );


  document.getElementById(
    "tradeCount"
  ).textContent =
    STATE.trades.length;


  document.getElementById(
    "portfolioXP"
  ).textContent =
    STATE.xp;


  const positions =
    document.getElementById(
      "positionsList"
    );


  const entries =
    Object.entries(
      STATE.positions
    );


  if (!entries.length) {

    positions.innerHTML =
      `
        <div class="position-card">
          <span style="color:#8b96a5;font-size:12px">
            Noch keine offenen Positionen.
          </span>
        </div>
      `;

  } else {

    positions.innerHTML =
      entries
        .map(
          ([symbol, position]) => {

            const asset =
              ASSETS[symbol];

            const pnl =
              (
                PRICES[symbol] -
                position.entry
              ) *
              position.quantity;

            return `

              <div class="position-card">

                <div class="position-main">

                  <strong>
                    ${asset.icon}
                    ${asset.name}
                  </strong>

                  <small>
                    ${num(
                      Math.abs(
                        position.quantity
                      )
                    )} ${asset.symbol}
                  </small>

                </div>

                <div class="position-pnl">

                  <strong
                    class="${
                      pnl >= 0
                        ? "positive"
                        : "negative"
                    }"
                  >
                    ${money(pnl)}
                  </strong>

                  <small>
                    Einstieg:
                    ${money(
                      position.entry
                    )}
                  </small>

                </div>

              </div>

            `;

          }
        )
        .join("");

  }


  renderHistory();

}


function renderHistory() {

  const container =
    document.getElementById(
      "tradeHistory"
    );

  if (!container)
    return;


  if (!STATE.trades.length) {

    container.innerHTML =
      `
        <div class="history-card">
          <span style="color:#8b96a5;font-size:12px">
            Noch keine Trades.
          </span>
        </div>
      `;

    return;

  }


  container.innerHTML =
    STATE.trades
      .slice(0, 20)
      .map(
        trade => {

          const asset =
            ASSETS[
              trade.symbol
            ];

          return `

            <div class="history-card">

              <div class="position-main">

                <strong>
                  ${asset.icon}
                  ${asset.symbol}
                </strong>

                <small>
                  ${new Date(
                    trade.time
                  ).toLocaleString(
                    "de-DE"
                  )}
                </small>

              </div>

              <div class="position-pnl">

                <strong
                  class="${
                    trade.side === "buy"
                      ? "positive"
                      : "negative"
                  }"
                >
                  ${
                    trade.side === "buy"
                      ? "KAUF"
                      : "VERKAUF"
                  }
                </strong>

                <small>
                  ${num(
                    trade.quantity
                  )} ×
                  ${money(
                    trade.price
                  )}
                </small>

              </div>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================
   HOME
========================= */

function renderHome() {

  const total =
    portfolioValue();

  const profit =
    totalProfit();

  const percent =
    (
      profit /
      STATE.startCash
    ) * 100;


  document.getElementById(
    "homeBalance"
  ).textContent =
    money(total);


  document.getElementById(
    "homeProfit"
  ).textContent =
    money(profit);


  document.getElementById(
    "homeProfitPercent"
  ).textContent =
    pct(percent);


  const lvl =
    getLevel();


  document.getElementById(
    "homeLevel"
  ).textContent =
    lvl;


  document.getElementById(
    "homeXP"
  ).textContent =
    STATE.xp;


  document.getElementById(
    "homeXPBar"
  ).style.width =
    getProgress() +
    "%";


  renderHomeMarkets();

  renderHomeMissions();

}


function renderHomeMissions() {

  const container =
    document.getElementById(
      "homeMissions"
    );

  if (!container)
    return;


  const mission =
    MISSIONS.find(
      m =>
        !STATE.missions.includes(
          m.id
        )
    );


  if (!mission) {

    container.innerHTML =
      `
        <div class="mission-card">
          <strong>
            🎉 Alle aktuellen Missionen abgeschlossen!
          </strong>
        </div>
      `;

    return;

  }


  container.innerHTML =
    `
      <div class="mission-card">

        <h3>
          ${mission.title}
        </h3>

        <p>
          ${mission.text}
        </p>

        <strong>
          +${mission.xp} XP
        </strong>

      </div>
    `;

}


/* =========================
   LEARNING
========================= */

function renderLessons() {

  const container =
    document.getElementById(
      "lessonList"
    );

  if (!container)
    return;


  container.innerHTML =
    LESSONS
      .map(
        lesson => {

          const completed =
            STATE.lessons.includes(
              lesson.id
            );


          return `

            <article
              class="lesson-card
              ${
                completed
                  ? "completed"
                  : ""
              }"
            >

              <h3>
                ${lesson.title}
              </h3>

              <p>
                ${lesson.text}
              </p>

              ${
                completed

                  ? `
                    <strong class="positive">
                      ✓ Abgeschlossen
                    </strong>
                  `

                  : `

                    <button
                      class="lesson-button"
                      data-lesson="${lesson.id}"
                    >
                      Lektion starten
                    </button>

                    <div
                      class="quiz"
                      id="quiz-${lesson.id}"
                      hidden
                    >

                      <strong>
                        ${lesson.question}
                      </strong>

                      ${lesson.answers
                        .map(
                          (answer, index) => `

                            <button
                              data-answer="${index}"
                              data-quiz="${lesson.id}"
                            >
                              ${answer}
                            </button>

                          `
                        )
                        .join("")}

                    </div>

                  `
              }

            </article>

          `;

        }
      )
      .join("");


  document.getElementById(
    "learnLevel"
  ).textContent =
    getLevel();


  document.getElementById(
    "learnXP"
  ).textContent =
    STATE.xp;


  document.getElementById(
    "learnXPBar"
  ).style.width =
    getProgress() +
    "%";


  renderMissions();

}


function renderMissions() {

  const container =
    document.getElementById(
      "missionList"
    );

  if (!container)
    return;


  container.innerHTML =
    MISSIONS
      .map(
        mission => {

          const completed =
            STATE.missions.includes(
              mission.id
            );


          return `

            <div class="mission-card">

              <h3>
                ${mission.title}
              </h3>

              <p>
                ${mission.text}
              </p>

              <strong
                class="${
                  completed
                    ? "positive"
                    : ""
                }"
              >
                ${
                  completed
                    ? "✓ Abgeschlossen"
                    : "+" +
                      mission.xp +
                      " XP"
                }
              </strong>

            </div>

          `;

        }
      )
      .join("");

}


function checkMissions() {

  MISSIONS.forEach(
    mission => {

      if (
        !STATE.missions.includes(
          mission.id
        ) &&
        mission.check()
      ) {

        STATE.missions.push(
          mission.id
        );

        STATE.xp +=
          mission.xp;

        showToast(
          `Mission geschafft: ${mission.title} +${mission.xp} XP`
        );

      }

    }
  );


  checkAchievements();

}


/* =========================
   ACHIEVEMENTS
========================= */

function checkAchievements() {

  ACHIEVEMENTS.forEach(
    achievement => {

      if (
        !STATE.achievements.includes(
          achievement.id
        ) &&
        achievement.check()
      ) {

        STATE.achievements.push(
          achievement.id
        );

        showToast(
          `Achievement: ${achievement.title} 🏆`
        );

      }

    }
  );

}


function renderAchievements() {

  const container =
    document.getElementById(
      "achievements"
    );

  if (!container)
    return;


  container.innerHTML =
    ACHIEVEMENTS
      .map(
        achievement => {

          const unlocked =
            STATE.achievements.includes(
              achievement.id
            );


          return `

            <div
              class="achievement
              ${
                unlocked
                  ? ""
                  : "locked"
              }"
            >

              <div class="achievement-icon">
                ${achievement.icon}
              </div>

              <strong>
                ${achievement.title}
              </strong>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================
   JOURNAL
========================= */

function renderJournal() {

  const container =
    document.getElementById(
      "journalList"
    );

  if (!container)
    return;


  if (!STATE.journal.length) {

    container.innerHTML =
      `
        <div class="journal-entry">
          <span style="color:#8b96a5;font-size:12px">
            Noch keine Journal-Einträge.
          </span>
        </div>
      `;

    return;

  }


  container.innerHTML =
    STATE.journal
      .slice()
      .reverse()
      .map(
        entry => `

          <div class="journal-entry">

            <small>
              ${new Date(
                entry.time
              ).toLocaleString(
                "de-DE"
              )}
            </small>

            <p>
              ${escapeHTML(
                entry.text
              )}
            </p>

          </div>

        `
      )
      .join("");

}


function escapeHTML(text) {

  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function saveJournal() {

  const input =
    document.getElementById(
      "journalInput"
    );

  const text =
    input.value.trim();


  if (!text) {

    showToast(
      "Schreibe zuerst etwas."
    );

    return;

  }


  STATE.journal.push({

    text,

    time:
      Date.now()

  });


  STATE.xp += 10;

  checkMissions();

  save();

  input.value = "";

  renderAll();

  showToast(
    "Journal gespeichert +10 XP"
  );

}


/* =========================
   ORDERS
========================= */

function renderOrders() {

  const container =
    document.getElementById(
      "ordersList"
    );

  if (!container)
    return;


  if (!STATE.orders.length) {

    container.innerHTML =
      `
        <div class="order-card">
          <span style="color:#8b96a5;font-size:12px">
            Keine offenen Orders.
          </span>
        </div>
      `;

    return;

  }


  container.innerHTML =
    STATE.orders
      .map(
        order => {

          const asset =
            ASSETS[
              order.symbol
            ];

          return `

            <div class="order-card">

              <strong>
                ${order.type.toUpperCase()}
                · ${order.side.toUpperCase()}
              </strong>

              <p style="color:#8b96a5;font-size:11px;margin-top:6px">
                ${asset.symbol}
                · ${num(order.quantity)}
                · Trigger ${money(order.trigger)}
              </p>

            </div>

          `;

        }
      )
      .join("");

}


/* =========================
   PROFILE
========================= */

function renderProfile() {

  document.getElementById(
    "profileLevel"
  ).textContent =
    getLevel();


  document.getElementById(
    "profileXP"
  ).textContent =
    STATE.xp;


  document.getElementById(
    "profileTrades"
  ).textContent =
    STATE.trades.length;


  document.getElementById(
    "profileMissions"
  ).textContent =
    STATE.missions.length;


  renderAchievements();

}


/* =========================
   CHART
========================= */

function drawChart() {

  const canvas =
    document.getElementById(
      "tradingChart"
    );

  if (!canvas)
    return;


  const rect =
    canvas.getBoundingClientRect();

  if (
    rect.width <= 0 ||
    rect.height <= 0
  )
    return;


  const ratio =
    window.devicePixelRatio ||
    1;


  canvas.width =
    rect.width *
    ratio;

  canvas.height =
    rect.height *
    ratio;


  const ctx =
    canvas.getContext("2d");

  ctx.setTransform(
    ratio,
    0,
    0,
    ratio,
    0,
    0
  );


  const width =
    rect.width;

  const height =
    rect.height;


  const data =
    HISTORY[
      STATE.selectedAsset
    ];


  if (!data?.length)
    return;


  const min =
    Math.min(...data);

  const max =
    Math.max(...data);

  const range =
    max - min || 1;


  ctx.clearRect(
    0,
    0,
    width,
    height
  );


  /* grid */

  ctx.strokeStyle =
    "rgba(255,255,255,.06)";

  ctx.lineWidth = 1;


  for (
    let i = 1;
    i < 5;
    i++
  ) {

    const y =
      height *
      i /
      5;

    ctx.beginPath();

    ctx.moveTo(
      0,
      y
    );

    ctx.lineTo(
      width,
      y
    );

    ctx.stroke();

  }


  /* chart */

  ctx.beginPath();


  data.forEach(
    (value, index) => {

      const x =
        index /
        (data.length - 1) *
        width;


      const y =
        height -
        (
          (
            value -
            min
          ) /
          range
        ) *
        (
          height - 12
        ) -
        6
        );


      if (index === 0) {

        ctx.moveTo(
          x,
          y
        );

      } else {

        ctx.lineTo(
          x,
          y
        );

      }

    }
  );


  ctx.strokeStyle =
    "#b8ff3d";

  ctx.lineWidth = 2;

  ctx.stroke();

}


/* =========================
   MARKET PRICES
========================= */

function renderMarketPrices() {

  document
    .querySelectorAll(
      "[data-price]"
    )
    .forEach(
      element => {

        const symbol =
          element.dataset.price;

        if (
          PRICES[symbol] !==
          undefined
        ) {

          element.textContent =
            money(
              PRICES[symbol]
            );

        }

      }
    );

}


/* =========================
   SELECT ASSET
========================= */

function selectAsset(symbol) {

  if (!ASSETS[symbol])
    return;


  STATE.selectedAsset =
    symbol;


  save();

  renderAll();

  openPage("trade");

}


/* =========================
   EVENT SYSTEM
========================= */

document.addEventListener(
  "click",
  event => {

    /* NAVIGATION */

    const nav =
      event.target.closest(
        "[data-page]"
      );

    if (nav) {

      openPage(
        nav.dataset.page
      );

      return;

    }


    /* ASSET */

    const asset =
      event.target.closest(
        "[data-asset]"
      );

    if (asset) {

      selectAsset(
        asset.dataset.asset
      );

      return;

    }


    /* SIDE */

    const side =
      event.target.closest(
        "[data-side]"
      );

    if (side) {

      STATE.side =
        side.dataset.side;

      renderTrade();

      return;

    }


    /* ORDER TYPE */

    const order =
      event.target.closest(
        "[data-order]"
      );

    if (order) {

      STATE.orderType =
        order.dataset.order;


      const trigger =
        document.getElementById(
          "triggerRow"
        );


      trigger.classList.toggle(
        "hidden",
        STATE.orderType ===
        "market"
      );


      renderTrade();

      return;

    }


    /* LESSON */

    const lessonButton =
      event.target.closest(
        "[data-lesson]"
      );

    if (lessonButton) {

      const id =
        lessonButton.dataset.lesson;

      const quiz =
        document.getElementById(
          `quiz-${id}`
        );

      if (quiz) {

        quiz.hidden = false;

      }

      return;

    }


    /* QUIZ */

    const answer =
      event.target.closest(
        "[data-quiz]"
      );

    if (answer) {

      const id =
        answer.dataset.quiz;

      const lesson =
        LESSONS.find(
          item =>
            item.id === id
        );

      const selected =
        Number(
          answer.dataset.answer
        );


      if (
        selected ===
        lesson.correct
      ) {

        if (
          !STATE.lessons.includes(
            id
          )
        ) {

          STATE.lessons.push(id);

          STATE.xp += 20;

          checkMissions();

          save();

          renderAll();

          showToast(
            "Richtig! +20 XP 🎉"
          );

        }

      } else {

        showToast(
          "Noch nicht richtig. Versuch es nochmal."
        );

      }

      return;

    }


    /* TRADE */

    if (
      event.target.closest(
        "#executeTrade"
      )
    ) {

      if (
        STATE.orderType ===
        "market"
      ) {

        executeMarketTrade();

      } else {

        createOrder();

      }

      return;

    }


    /* JOURNAL */

    if (
      event.target.closest(
        "#saveJournal"
      )
    ) {

      saveJournal();

      return;

    }


    /* RESET */

    if (
      event.target.closest(
        "#resetApp"
      )
    ) {

      const confirmReset =
        confirm(
          "Wirklich alles zurücksetzen?"
        );

      if (!confirmReset)
        return;


      localStorage.removeItem(
        STORAGE_KEY
      );

      location.reload();

    }

  }
);


/* =========================
   SEARCH
========================= */

document
  .getElementById(
    "marketSearch"
  )
  .addEventListener(
    "input",
    event => {

      STATE.search =
        event.target.value;

      renderMarkets();

    }
  );


/* =========================
   FILTER
========================= */

document
  .querySelectorAll(
    ".filter"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".filter"
            )
            .forEach(
              b =>
                b.classList.remove(
                  "active"
                )
            );


          button.classList.add(
            "active"
          );


          STATE.filter =
            button.dataset.filter;


          renderMarkets();

        }
      );

    }
  );


/* =========================
   QUANTITY CHANGE
========================= */

document
  .getElementById(
    "tradeQuantity"
  )
  .addEventListener(
    "input",
    renderTrade
  );


/* =========================
   INITIAL RENDER
========================= */

function renderAll() {

  renderHome();

  renderMarkets();

  renderTrade();

  renderPortfolio();

  renderLessons();

  renderJournal();

  renderOrders();

  renderProfile();

  drawChart();

}


renderAll();


/* =========================
   REAL-TIME SIMULATION
========================= */

setInterval(
  updateMarkets,
  1000
);


/* =========================
   RESPONSIVE CHART
========================= */

window.addEventListener(
  "resize",
  drawChart
);


console.log(
  "TradeQuest gestartet — virtuelle Trading-Simulation aktiv."
);