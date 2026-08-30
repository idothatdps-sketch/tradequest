/* =====================================================
   TRADEQUEST
   Vollständiger Trading-Lern-Simulator
   Nur virtuelles Geld
===================================================== */
const ASSETS = {
  BTC:{name:"Bitcoin",symbol:"BTC",icon:"₿",type:"crypto",price:62000,vol:.0022},
  ETH:{name:"Ethereum",symbol:"ETH",icon:"Ξ",type:"crypto",price:2800,vol:.0028},
  SOL:{name:"Solana",symbol:"SOL",icon:"S",type:"crypto",price:145,vol:.004},
  XRP:{name:"XRP",symbol:"XRP",icon:"X",type:"crypto",price:2.65,vol:.0035},
  AAPL:{name:"Apple",symbol:"AAPL",icon:"A",type:"stocks",price:229,vol:.0014},
  NVDA:{name:"NVIDIA",symbol:"NVDA",icon:"N",type:"stocks",price:177,vol:.002},
  TSLA:{name:"Tesla",symbol:"TSLA",icon:"T",type:"stocks",price:335,vol:.0025},
  MSFT:{name:"Microsoft",symbol:"MSFT",icon:"M",type:"stocks",price:505,vol:.0012},
  SPY:{name:"S&P 500 ETF",symbol:"SPY",icon:"E",type:"etf",price:646,vol:.001},
  QQQ:{name:"Nasdaq 100 ETF",symbol:"QQQ",icon:"Q",type:"etf",price:575,vol:.0012},
  EURUSD:{name:"Euro / US Dollar",symbol:"EURUSD",icon:"€",type:"forex",price:1.17,vol:.0008},
  GOLD:{name:"Gold",symbol:"XAU",icon:"Au",type:"commodity",price:3370,vol:.0008}
};
const LESSONS = [
  {
    id:"l1",
    title:"Trading-Grundlagen",
    tag:"LEVEL 1",
    text:"Was sind Assets, Börsen, Broker und Orders?",
    q:"Was bedeutet eine Market Order?",
    a:[
      "Sie wird zum aktuell verfügbaren Preis ausgeführt.",
      "Sie wartet immer bis morgen.",
      "Sie ist ein Sparplan."
    ],
    correct:0
  },
  {
    id:"l2",
    title:"Candlesticks lesen",
    tag:"LEVEL 2",
    text:"Verstehe Open, High, Low und Close.",
    q:"Was zeigt eine grüne Kerze typischerweise?",
    a:[
      "Der Schlusskurs liegt über dem Eröffnungskurs.",
      "Der Markt war geschlossen.",
      "Es gab keine Trades."
    ],
    correct:0
  },
  {
    id:"l3",
    title:"Orders verstehen",
    tag:"LEVEL 3",
    text:"Market, Limit, Stop Loss und Take Profit.",
    q:"Wofür wird ein Stop Loss genutzt?",
    a:[
      "Um Verluste zu begrenzen.",
      "Um garantiert Gewinn zu machen.",
      "Um Gebühren zu vermeiden."
    ],
    correct:0
  },
  {
    id:"l4",
    title:"Risiko-Management",
    tag:"LEVEL 4",
    text:"Positionsgröße, Risiko pro Trade und Diversifikation.",
    q:"Was ist meist sinnvoller?",
    a:[
      "Das gesamte Konto auf einen Trade setzen.",
      "Das Risiko pro Trade begrenzen.",
      "Stop Loss nie verwenden."
    ],
    correct:1
  },
  {
    id:"l5",
    title:"Strategien",
    tag:"LEVEL 5",
    text:"Trend Following, Breakout, DCA und Swing Trading.",
    q:"Was bedeutet DCA?",
    a:[
      "Regelmäßig investieren.",
      "Nur am Tageshoch kaufen.",
      "Immer Short gehen."
    ],
    correct:0
  },
  {
    id:"l6",
    title:"Trading-Journal",
    tag:"LEVEL 6",
    text:"Dokumentiere deine Entscheidungen und lerne aus Fehlern.",
    q:"Warum ein Journal führen?",
    a:[
      "Um Entscheidungen zu reflektieren.",
      "Um Gewinne zu garantieren.",
      "Um Gebühren zu umgehen."
    ],
    correct:0
  }
];
const MISSIONS = [
  {
    id:"m1",
    title:"Erster Trade",
    text:"Platziere deinen ersten simulierten Trade.",
    xp:50,
    check:s=>s.trades.length>=1
  },
  {
    id:"m2",
    title:"Lernstarter",
    text:"Schließe eine Lektion ab.",
    xp:30,
    check:s=>s.completedLessons.length>=1
  },
  {
    id:"m3",
    title:"10 Trades",
    text:"Führe zehn simulierte Trades aus.",
    xp:100,
    check:s=>s.trades.length>=10
  },
  {
    id:"m4",
    title:"Risikoprofi",
    text:"Verwende eine Risiko-Order.",
    xp:100,
    check:s=>s.riskOrders>=1
  },
  {
    id:"m5",
    title:"Trader-Level 5",
    text:"Erreiche Level 5.",
    xp:200,
    check:s=>level()>=5
  }
];
const ACHIEVEMENTS = [
  ["first","🥇","Erster Trade",s=>s.trades.length>=1],
  ["ten","🔥","10 Trades",s=>s.trades.length>=10],
  ["lesson","📚","Erste Lektion",s=>s.completedLessons.length>=1],
  ["risk","🛡️","Risikoprofi",s=>s.riskOrders>=1],
  ["level5","⭐","Level 5",s=>level()>=5],
  ["journal","📓","Journalist",s=>s.journal.length>=3]
];
let state = JSON.parse(localStorage.getItem("tradequest")) || {
  cash:10000,
  startingCash:10000,
  positions:{},
  trades:[],
  completedLessons:[],
  claimedMissions:[],
  riskOrders:0,
  xp:0,
  journal:[]
};
let prices = {};
Object.keys(ASSETS).forEach(symbol=>{
  prices[symbol] = ASSETS[symbol].price;
});
let selectedAsset = "BTC";
let selectedSide = "buy";
let selectedFilter = "all";
/* =========================
   STORAGE
========================= */
function save(){
  localStorage.setItem("tradequest",JSON.stringify(state));
}
/* =========================
   FORMAT
========================= */
function money(value){
  return new Intl.NumberFormat("de-DE",{
    style:"currency",
    currency:"EUR",
    maximumFractionDigits:2
  }).format(value);
}
function number(value){
  return new Intl.NumberFormat("de-DE",{
    maximumFractionDigits:4
  }).format(value);
}
function level(){
  return Math.floor(state.xp / 250) + 1;
}
/* =========================
   NAVIGATION
========================= */
function showPage(page){
  document.querySelectorAll(".page").forEach(p=>{
    p.classList.remove("active");
  });
  const target=document.getElementById(page);
  if(target){
    target.classList.add("active");
  }
  document.querySelectorAll(".bottom-nav button").forEach(btn=>{
    btn.classList.toggle(
      "active",
      btn.dataset.page===page
    );
  });
  if(page==="home") renderHome();
  if(page==="markets") renderMarkets();
  if(page==="trade") updateTradePanel();
  if(page==="portfolio") renderPortfolio();
  if(page==="learn") renderLessons();
  if(page==="missions") renderMissions();
  if(page==="journal") renderJournal();
  window.scrollTo({
    top:0,
    behavior:"smooth"
  });
}
/* =========================
   TOAST
========================= */
function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message;
  el.style.display="block";
  clearTimeout(window.toastTimer);
  window.toastTimer=setTimeout(()=>{
    el.style.display="none";
  },2500);
}
/* =========================
   MARKET SIMULATION
========================= */
function updatePrices(){
  Object.keys(ASSETS).forEach(symbol=>{
    const asset=ASSETS[symbol];
    const random=(Math.random()-.5)*2;
    prices[symbol] *= 1 + random*asset.vol;
    if(prices[symbol]<=0){
      prices[symbol]=asset.price;
    }
  });
  renderHomeMarkets();
  renderMarkets();
  updateTradePanel();
  renderPortfolio();
  drawChart();
}
/* =========================
   HOME
========================= */
function renderHome(){
  const total=portfolioValue();
  document.getElementById("homeBalance").textContent=money(total);
  document.getElementById("homePnL").textContent=
    money(total-state.startingCash);
  document.getElementById("homeLevel").textContent=level();
  document.getElementById("homeXP").textContent=state.xp;
  const progress=
    Math.min(
      100,
      Math.round(
        state.completedLessons.length/
        LESSONS.length*100
      )
    );
  document.getElementById("lessonProgress").textContent=progress+"%";
  document.getElementById("lessonBar").style.width=progress+"%";
  renderHomeMarkets();
}
function renderHomeMarkets(){
  const container=document.getElementById("homeMarkets");
  if(!container)return;
  const symbols=["BTC","ETH","SOL","AAPL"];
  container.innerHTML=symbols.map(symbol=>marketCard(symbol)).join("");
}
function marketCard(symbol){
  const a=ASSETS[symbol];
  const p=prices[symbol];
  return `
    <div class="market" onclick="openAsset('${symbol}')">
      <div class="market-top">
        <div class="icon">${a.icon}</div>
        <div>
          <strong>${a.name}</strong>
          <div class="market-symbol">${a.symbol}</div>
        </div>
      </div>
      <div class="market-price">${money(p)}</div>
      <div class="green">Live • simuliert</div>
    </div>
  `;
}
/* =========================
   MARKETS
========================= */
function setFilter(filter){
  selectedFilter=filter;
  renderMarkets();
}
function renderMarkets(){
  const container=document.getElementById("marketsList");
  if(!container)return;
  const search=
    (document.getElementById("searchInput")?.value || "")
    .toLowerCase();
  const assets=Object.entries(ASSETS)
    .filter(([symbol,a])=>
      selectedFilter==="all" ||
      a.type===selectedFilter
    )
    .filter(([symbol,a])=>
      a.name.toLowerCase().includes(search) ||
      symbol.toLowerCase().includes(search)
    );
  container.innerHTML=assets.map(([symbol,a])=>`
    <div class="market-row" onclick="openAsset('${symbol}')">
      <div class="market-top">
        <div class="icon">${a.icon}</div>
        <div>
          <strong>${a.name}</strong>
          <div class="market-symbol">${a.symbol}</div>
        </div>
      </div>
      <strong>${money(prices[symbol])}</strong>
      <span class="green">● Live</span>
      <button onclick="event.stopPropagation();openAsset('${symbol}')">
        Trade
      </button>
    </div>
  `).join("");
}
/* =========================
   TRADE
========================= */
function openAsset(symbol){
  selectedAsset=symbol;
  document.getElementById("tradeAsset").value=symbol;
  showPage("trade");
  updateTradePanel();
}
function setupTradeAssets(){
  const select=document.getElementById("tradeAsset");
  select.innerHTML=Object.entries(ASSETS)
    .map(([symbol,a])=>
      `<option value="${symbol}">
        ${a.symbol} — ${a.name}
      </option>`
    )
    .join("");
  select.value=selectedAsset;
}
function updateTradePanel(){
  const symbol=document.getElementById("tradeAsset")?.value || selectedAsset;
  selectedAsset=symbol;
  const a=ASSETS[symbol];
  const p=prices[symbol];
  if(!a)return;
  document.getElementById("chartName").textContent=a.name;
  document.getElementById("chartPrice").textContent=money(p);
  document.getElementById("orderCurrentPrice").textContent=money(p);
  document.getElementById("orderCash").textContent=money(state.cash);
  drawChart();
}
function setSide(side){
  selectedSide=side;
  document.getElementById("buyTab")
    .classList.toggle("selected",side==="buy");
  document.getElementById("sellTab")
    .classList.toggle("selected",side==="sell");
}
function updateOrderType(){
  const type=document.getElementById("orderType").value;
  document.getElementById("priceInputBox")
    .classList.toggle(
      "hidden",
      type==="market"
    );
}
function executeTrade(){
  const symbol=selectedAsset;
  const quantity=parseFloat(
    document.getElementById("quantity").value
  );
  if(!quantity || quantity<=0){
    toast("Bitte eine gültige Menge eingeben.");
    return;
  }
  const price=parseFloat(
    document.getElementById("orderPrice").value
  ) || prices[symbol];
  const value=quantity*price;
  const fee=value*0.001;
  if(selectedSide==="buy"){
    const total=value+fee;
    if(total>state.cash){
      toast("Nicht genug virtuelles Geld.");
      return;
    }
    state.cash-=total;
    if(!state.positions[symbol]){
      state.positions[symbol]={
        quantity:0,
        avgPrice:0
      };
    }
    const pos=state.positions[symbol];
    const oldValue=pos.quantity*pos.avgPrice;
    pos.quantity+=quantity;
    pos.avgPrice=
      (oldValue+value)/pos.quantity;
  }else{
    const pos=state.positions[symbol];
    if(!pos || pos.quantity<quantity){
      toast("Du besitzt nicht genug von diesem Asset.");
      return;
    }
    state.cash+=value-fee;
    pos.quantity-=quantity;
    if(pos.quantity<=0){
      delete state.positions[symbol];
    }
  }
  state.trades.unshift({
    id:Date.now(),
    symbol,
    side:selectedSide,
    quantity,
    price,
    value,
    fee,
    date:new Date().toLocaleString("de-DE")
  });
  const risk=document.getElementById("riskCheck").checked;
  if(risk){
    state.riskOrders++;
  }
  addXP(20);
  save();
  document.getElementById("quantity").value="";
  toast(
    `${selectedSide==="buy"?"Kauf":"Verkauf"} erfolgreich simuliert!`
  );
  renderPortfolio();
  renderHome();
  renderMissions();
}
/* =========================
   PORTFOLIO
========================= */
function portfolioValue(){
  let total=state.cash;
  Object.entries(state.positions).forEach(([symbol,pos])=>{
    total+=pos.quantity*prices[symbol];
  });
  return total;
}
function investedValue(){
  let total=0;
  Object.entries(state.positions).forEach(([symbol,pos])=>{
    total+=pos.quantity*prices[symbol];
  });
  return total;
}
function renderPortfolio(){
  const total=portfolioValue();
  document.getElementById("portfolioBalance").textContent=money(total);
  document.getElementById("portfolioPnL").textContent=
    (total>=state.startingCash?"+":"")+
    money(total-state.startingCash);
  document.getElementById("portfolioCash").textContent=money(state.cash);
  document.getElementById("investedValue").textContent=money(investedValue());
  document.getElementById("tradeCount").textContent=state.trades.length;
  const positions=document.getElementById("positions");
  const entries=Object.entries(state.positions);
  if(!entries.length){
    positions.innerHTML=`
      <div class="position">
        <span>Noch keine offenen Positionen.</span>
      </div>
    `;
  }else{
    positions.innerHTML=entries.map(([symbol,pos])=>{
      const current=prices[symbol];
      const pnl=
        (current-pos.avgPrice)*pos.quantity;
      return `
        <div class="position">
          <div>
            <strong>${ASSETS[symbol].name}</strong>
            <small>
              ${number(pos.quantity)} ${symbol}
            </small>
          </div>
          <div>
            <strong>${money(current*pos.quantity)}</strong>
            <small class="${pnl>=0?'green':'red'}">
              ${pnl>=0?"+":""}${money(pnl)}
            </small>
          </div>
        </div>
      `;
    }).join("");
  }
  const history=document.getElementById("history");
  if(!state.trades.length){
    history.innerHTML=`
      <div class="history-item">
        Noch keine Trades.
      </div>
    `;
  }else{
    history.innerHTML=state.trades.slice(0,20).map(t=>`
      <div class="history-item">
        <div>
          <strong>
            ${t.side==="buy"?"KAUF":"VERKAUF"} ${t.symbol}
          </strong>
          <small>
            ${number(t.quantity)} × ${money(t.price)}
          </small>
        </div>
        <div>
          <strong>${money(t.value)}</strong>
          <small>${t.date}</small>
        </div>
      </div>
    `).join("");
  }
}
/* =========================
   LEARNING
========================= */
function renderLessons(){
  const container=document.getElementById("lessons");
  container.innerHTML=LESSONS.map((lesson,index)=>{
    const done=
      state.completedLessons.includes(lesson.id);
    return `
      <div class="lesson ${done?"completed":""}">
        <p class="eyebrow">${lesson.tag}</p>
        <h3>${lesson.title}</h3>
        <p>${lesson.text}</p>
        <button onclick="startLesson(${index})">
          ${done?"✓ Abgeschlossen":"Lektion starten"}
        </button>
      </div>
    `;
  }).join("");
}
function startLesson(index){
  const lesson=LESSONS[index];
  const answer=prompt(
    `${lesson.title}\n\n${lesson.text}\n\n${lesson.q}\n\n`+
    lesson.a.map((x,i)=>`${i+1}. ${x}`).join("\n")
  );
  if(answer===null)return;
  const selected=parseInt(answer)-1;
  if(selected===lesson.correct){
    if(!state.completedLessons.includes(lesson.id)){
      state.completedLessons.push(lesson.id);
      addXP(50);
      save();
      toast("✅ Richtig! +50 XP");
    }else{
      toast("Diese Lektion hast du bereits abgeschlossen.");
    }
  }else{
    toast("❌ Noch nicht richtig. Lies die Lektion nochmal.");
  }
  renderLessons();
  renderHome();
  renderMissions();
}
/* =========================
   XP
========================= */
function addXP(amount){
  const oldLevel=level();
  state.xp+=amount;
  const newLevel=level();
  if(newLevel>oldLevel){
    toast(`🎉 Level ${newLevel} erreicht!`);
  }
  save();
}
/* =========================
   MISSIONS
========================= */
function renderMissions(){
  const container=document.getElementById("missionsList");
  container.innerHTML=MISSIONS.map(m=>{
    const done=m.check(state);
    const claimed=
      state.claimedMissions.includes(m.id);
    return `
      <div class="mission ${done?"done":""}">
        <div>
          <strong>${done?"✓ ":""}${m.title}</strong>
          <p>${m.text}</p>
        </div>
        <div>
          <strong>+${m.xp} XP</strong>
          ${
            done && !claimed
            ? `<button onclick="claimMission('${m.id}')">Abholen</button>`
            : claimed
            ? `<span class="green">✓</span>`
            : `<span>🔒</span>`
          }
        </div>
      </div>
    `;
  }).join("");
  renderAchievements();
}
function claimMission(id){
  const mission=MISSIONS.find(m=>m.id===id);
  if(!mission)return;
  if(!mission.check(state))return;
  if(state.claimedMissions.includes(id))return;
  state.claimedMissions.push(id);
  addXP(mission.xp);
  save();
  toast(`🏆 Mission abgeschlossen! +${mission.xp} XP`);
  renderMissions();
}
/* =========================
   ACHIEVEMENTS
========================= */
function renderAchievements(){
  const container=document.getElementById("achievements");
  container.innerHTML=ACHIEVEMENTS.map(a=>{
    const unlocked=a[3](state);
    return `
      <div class="achievement ${unlocked?"unlocked":""}">
        <div>${a[1]}</div>
        <strong>${a[2]}</strong>
        <p>
          ${unlocked?"Freigeschaltet":"Noch gesperrt"}
        </p>
      </div>
    `;
  }).join("");
}
/* =========================
   JOURNAL
========================= */
function saveJournal(){
  const text=
    document.getElementById("journalText").value.trim();
  if(!text){
    toast("Schreibe zuerst etwas ins Journal.");
    return;
  }
  state.journal.unshift({
    text,
    date:new Date().toLocaleString("de-DE")
  });
  addXP(15);
  save();
  document.getElementById("journalText").value="";
  toast("📓 Journal gespeichert! +15 XP");
  renderJournal();
  renderMissions();
}
function renderJournal(){
  const container=document.getElementById("journalList");
  if(!state.journal.length){
    container.innerHTML=`
      <div class="journal-entry">
        Noch keine Journal-Einträge.
      </div>
    `;
    return;
  }
  container.innerHTML=state.journal.map(entry=>`
    <div class="journal-entry">
      <small>${entry.date}</small>
      <p style="margin-top:8px;line-height:1.5;">
        ${escapeHTML(entry.text)}
      </p>
    </div>
  `).join("");
}
function escapeHTML(text){
  return text
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
/* =========================
   CHART
========================= */
let chartHistory={};
function generateHistory(){
  Object.keys(ASSETS).forEach(symbol=>{
    let p=prices[symbol];
    chartHistory[symbol]=[];
    for(let i=0;i<80;i++){
      p*=1+(Math.random()-.5)*ASSETS[symbol].vol*4;
      chartHistory[symbol].push(p);
    }
  });
}
function drawChart(){
  const canvas=document.getElementById("chart");
  if(!canvas || !canvas.offsetWidth)return;
  const ctx=canvas.getContext("2d");
  const width=canvas.clientWidth;
  const height=canvas.clientHeight;
  canvas.width=width*2;
  canvas.height=height*2;
  ctx.scale(2,2);
  ctx.clearRect(0,0,width,height);
  const symbol=selectedAsset;
  if(!chartHistory[symbol]){
    generateHistory();
  }
  const data=chartHistory[symbol];
  data.push(prices[symbol]);
  if(data.length>80){
    data.shift();
  }
  const min=Math.min(...data);
  const max=Math.max(...data);
  ctx.beginPath();
  data.forEach((value,i)=>{
    const x=i/(data.length-1)*width;
    const y=
      height-
      ((value-min)/(max-min || 1))*
      (height-30)-15;
    if(i===0)ctx.moveTo(x,y);
    else ctx.lineTo(x,y);
  });
  ctx.strokeStyle="#6c7cff";
  ctx.lineWidth=3;
  ctx.stroke();
  ctx.lineTo(width,height);
  ctx.lineTo(0,height);
  ctx.closePath();
  ctx.fillStyle="rgba(108,124,255,.08)";
  ctx.fill();
}
function setTimeframe(){
  generateHistory();
  drawChart();
}
/* =========================
   SETUP
========================= */
function setup(){
  setupTradeAssets();
  generateHistory();
  renderHome();
  renderMarkets();
  renderPortfolio();
  renderLessons();
  renderMissions();
  renderJournal();
  showPage("home");
}
/* =========================
   START
========================= */
setup();
/*
   MARKT-UPDATE:
   Alle 1 Sekunde.
*/
setInterval(updatePrices,1000);
``