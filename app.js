/* =========================================================
   TRADEQUEST
   Complete Trading Learning Simulation
   Virtuelles Geld – keine Echtgeld-Trades
========================================================= */
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
  text:"Lerne die wichtigsten Begriffe: Assets, Börse, Broker und Orders.",
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
  text:"Verstehe Open, High, Low und Close und erkenne einfache Trends.",
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
  text:"Market, Limit, Stop Loss und Take Profit haben unterschiedliche Aufgaben.",
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
  text:"Lerne Positionsgröße, Risiko pro Trade, Risk/Reward und Diversifikation.",
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
  title:"Trading-Strategien",
  tag:"LEVEL 5",
  text:"Lerne Trend Following, Breakouts, DCA und Swing Trading kennen.",
  q:"Was bedeutet DCA?",
  a:[
   "Regelmäßig investieren, unabhängig vom kurzfristigen Kurs.",
   "Nur am Tageshoch kaufen.",
   "Immer Short gehen."
  ],
  correct:0
 },
 {
  id:"l6",
  title:"Trading-Journal",
  tag:"LEVEL 6",
  text:"Dokumentiere deine Entscheidungen und analysiere deine Fehler.",
  q:"Warum ein Trading-Journal führen?",
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
  text:"Verwende Stop Loss oder Take Profit.",
  xp:100,
  check:s=>s.riskOrders>=1
 },
 {
  id:"m5",
  title:"Trader-Level 5",
  text:"Erreiche Level 5.",
  xp:200,
  check:s=>getLevel()>=5
 }
];
const ACH = [
 ["first","🥇","Erster Trade",s=>s.trades.length>=1],
 ["ten","🔥","10 Trades",s=>s.trades.length>=10],
 ["lesson","📚","Erste Lektion",s=>s.completedLessons.length>=1],
 ["risk","🛡️","Risikoprofi",s=>s.riskOrders>=1],
 ["level5","⭐","Level 5",s=>getLevel()>=5],
 ["journal","📓","Journalist",s=>s.journal.length>=3]
];
let state = loadState();
let selectedAsset = "BTC";
let orderSide = "buy";
let chartType = "line";
let chartHistory = {};
let activeFilter = "all";
let currentLesson = null;
/* =========================================================
   STATE
========================================================= */
function defaultState(){
 return {
  cash:10000,
  startingCash:10000,
  positions:{},
  trades:[],
  xp:0,
  completedLessons:[],
  claimedMissions:[],
  riskOrders:0,
  journal:[],
  fees:0
 };
}
function loadState(){
 try{
  const saved = localStorage.getItem("tradequest_v2");
  return saved ? {...defaultState(),...JSON.parse(saved)} : defaultState();
 }catch{
  return defaultState();
 }
}
function saveState(){
 localStorage.setItem("tradequest_v2",JSON.stringify(state));
}
function getLevel(){
 return Math.floor(state.xp / 100) + 1;
}
function xpIntoLevel(){
 return state.xp % 100;
}
/* =========================================================
   HELPERS
========================================================= */
function euro(n){
 return new Intl.NumberFormat("de-DE",{
  style:"currency",
  currency:"EUR",
  minimumFractionDigits:2
 }).format(n);
}
function num(n){
 return new Intl.NumberFormat("de-DE",{
  minimumFractionDigits:2,
  maximumFractionDigits:6
 }).format(n);
}
function pct(n){
 return `${n>=0?"+":""}${n.toFixed(2)}%`;
}
function toast(message){
 const el=document.getElementById("toast");
 el.textContent=message;
 el.classList.add("show");
 setTimeout(()=>{
  el.classList.remove("show");
 },2500);
}
/* =========================================================
   MARKET ENGINE
========================================================= */
Object.keys(ASSETS).forEach(symbol=>{
 chartHistory[symbol]=[];
 let p=ASSETS[symbol].price;
 for(let i=0;i<80;i++){
  p *= 1 + (Math.random()-.5)*ASSETS[symbol].vol*3;
  chartHistory[symbol].push(p);
 }
 ASSETS[symbol].price=p;
});
function updateMarkets(){
 Object.keys(ASSETS).forEach(symbol=>{
  const a=ASSETS[symbol];
  const movement=(Math.random()-.5)*a.vol*2;
  a.price *= 1+movement;
  if(a.price<=0) a.price=.01;
  chartHistory[symbol].push(a.price);
  if(chartHistory[symbol].length>100){
   chartHistory[symbol].shift();
  }
 });
 renderAll();
}
setInterval(updateMarkets,1000);
/* =========================================================
   NAVIGATION
========================================================= */
function showPage(page){
 document.querySelectorAll(".page").forEach(p=>{
  p.classList.remove("active");
 });
 const target=document.getElementById(page+"Page");
 if(target){
  target.classList.add("active");
 }
 document.querySelectorAll(".nav-item").forEach(btn=>{
  btn.classList.toggle("active",btn.dataset.page===page);
 });
 window.scrollTo({top:0,behavior:"smooth"});
 if(page==="trade"){
  drawChart();
 }
 if(page==="markets"){
  renderMarkets();
 }
 if(page==="learn"){
  renderLessons();
 }
 if(page==="portfolio"){
  renderPortfolio();
 }
 if(page==="missions"){
  renderMissions();
 }
 if(page==="journal"){
  renderJournal();
 }
}
/* =========================================================
   NAV CLICK HANDLERS
========================================================= */
document.addEventListener("click",e=>{
 const nav=e.target.closest("[data-page]");
 if(nav){
  showPage(nav.dataset.page);
 }
 const tradeBtn=e.target.closest("[data-trade]");
 if(tradeBtn){
  selectedAsset=tradeBtn.dataset.trade;
  showPage("trade");
  updateTradeScreen();
 }
 const filter=e.target.closest(".market-filter");
 if(filter){
  document.querySelectorAll(".market-filter")
   .forEach(x=>x.classList.remove("active"));
  filter.classList.add("active");
  activeFilter=filter.dataset.filter;
  renderMarkets();
 }
 const chartButton=e.target.closest(".chart-type");
 if(chartButton){
  document.querySelectorAll(".chart-type")
   .forEach(x=>x.classList.remove("active"));
  chartButton.classList.add("active");
  chartType=chartButton.dataset.chart;
  drawChart();
 }
 const timeButton=e.target.closest(".time-btn");
 if(timeButton){
  document.querySelectorAll(".time-btn")
   .forEach(x=>x.classList.remove("active"));
  timeButton.classList.add("active");
  drawChart();
 }
 const side=e.target.closest(".order-tab");
 if(side){
  document.querySelectorAll(".order-tab")
   .forEach(x=>x.classList.remove("active"));
  side.classList.add("active");
  orderSide=side.dataset.side;
  updateOrderButton();
 }
 const quick=e.target.closest(".quick-amounts button");
 if(quick){
  const percent=Number(quick.dataset.percent);
  const position=state.positions[selectedAsset];
  let available=orderSide==="buy"
   ? state.cash
   : ((position?.quantity||0)*ASSETS[selectedAsset].price);
  document.getElementById("orderAmount").value =
   (available*percent/100).toFixed(2);
  updateOrderSummary();
 }
});
/* =========================================================
   HOME
========================================================= */
function portfolioValue(){
 let value=state.cash;
 Object.keys(state.positions).forEach(symbol=>{
  const pos=state.positions[symbol];
  value += pos.quantity * ASSETS[symbol].price;
 });
 return value;
}
function totalPnl(){
 return portfolioValue()-state.startingCash;
}
function renderHome(){
 const equity=portfolioValue();
 const pnl=totalPnl();
 document.getElementById("topBalance").textContent=euro(state.cash);
 document.getElementById("heroPortfolio").textContent=euro(equity);
 document.getElementById("heroPnl").textContent =
  `${pnl>=0?"+":""}${euro(pnl)} (${pct(pnl/state.startingCash*100)})`;
 document.getElementById("statEquity").textContent=euro(equity);
 document.getElementById("statCash").textContent=euro(state.cash);
 const pnlEl=document.getElementById("statPnl");
 pnlEl.textContent=euro(pnl);
 pnlEl.className=pnl>=0?"change-up":"change-down";
 document.getElementById("statTrades").textContent=state.trades.length;
 const level=getLevel();
 const xp=xpIntoLevel();
 document.getElementById("homeLevel").textContent=`Level ${level}`;
 document.getElementById("xpBar").style.width=xp+"%";
 document.getElementById("xpText").textContent=`${xp} / 100 XP`;
 renderHomeMarkets();
 renderHomeMissions();
}
function renderHomeMarkets(){
 const symbols=["BTC","ETH","SOL","AAPL"];
 document.getElementById("homeMarkets").innerHTML=
 symbols.map(assetCard).join("");
}
function assetCard(symbol){
 const a=ASSETS[symbol];
 const previous=chartHistory[symbol]?.[chartHistory[symbol].length-2]||a.price;
 const change=(a.price/previous-1)*100;
 return `
 <div class="asset-card" data-trade="${symbol}">
   <div class="asset-top">
     <div class="asset-icon">${a.icon}</div>
     <span class="${change>=0?"change-up":"change-down"}">${pct(change)}</span>
   </div>
   <h3>${a.name}</h3>
   <span class="asset-symbol">${a.symbol}</span>
   <div class="asset-price">${euro(a.price)}</div>
   <div class="asset-change ${change>=0?"change-up":"change-down"}">
      ${change>=0?"▲":"▼"} ${pct(change)}
   </div>
 </div>
 `;
}
/* =========================================================
   MARKETS
========================================================= */
function renderMarkets(){
 const container=document.getElementById("marketsGrid");
 const symbols=Object.keys(ASSETS)
  .filter(s=>activeFilter==="all"||ASSETS[s].type===activeFilter);
 container.innerHTML=symbols.map(symbol=>{
  const a=ASSETS[symbol];
  const hist=chartHistory[symbol]||[];
  const old=hist[Math.max(0,hist.length-10)]||a.price;
  const change=(a.price/old-1)*100;
  return `
   <div class="market-card">
    <div class="market-info">
      <div class="asset-icon">${a.icon}</div>
      <div>
       <strong>${a.name}</strong>
       <div class="asset-symbol">${a.symbol}</div>
      </div>
    </div>
    <div class="market-price">${euro(a.price)}</div>
    <div class="${change>=0?"change-up":"change-down"}">
      ${pct(change)}
    </div>
    <button data-trade="${symbol}">
      Traden
    </button>
   </div>
  `;
 }).join("");
}
/* =========================================================
   TRADE SCREEN
========================================================= */
function updateTradeScreen(){
 const a=ASSETS[selectedAsset];
 document.getElementById("tradeIcon").textContent=a.icon;
 document.getElementById("tradeName").textContent=a.name;
 document.getElementById("tradeSymbol").textContent=a.symbol;
 document.getElementById("tradePrice").textContent=euro(a.price);
 const hist=chartHistory[selectedAsset]||[];
 const old=hist[hist.length-20]||a.price;
 const change=(a.price/old-1)*100;
 const changeEl=document.getElementById("tradeChange");
 changeEl.textContent=pct(change);
 changeEl.className=change>=0?"change-up":"change-down";
 document.getElementById("lastMove").textContent=pct(change);
 updateOrderSummary();
 drawChart();
}
function updateOrderButton(){
 const btn=document.getElementById("executeOrder");
 const a=ASSETS[selectedAsset];
 btn.textContent=
  orderSide==="buy"
   ? `${a.name} kaufen`
   : `${a.name} verkaufen`;
 btn.className=
  `trade-btn ${orderSide==="buy"?"buy":"sell"}`;
}
function updateOrderSummary(){
 const amount=Number(document.getElementById("orderAmount").value)||0;
 const fee=amount*.001;
 document.getElementById("summaryPrice").textContent=
  euro(ASSETS[selectedAsset].price);
 document.getElementById("summaryFee").textContent=
  euro(fee);
 document.getElementById("summaryTotal").textContent=
  euro(amount+fee);
 const limitBox=document.getElementById("limitBox");
 if(document.getElementById("orderType").value==="limit"){
  limitBox.classList.remove("hidden");
  document.getElementById("limitPrice").value=
   ASSETS[selectedAsset].price.toFixed(2);
 }else{
  limitBox.classList.add("hidden");
 }
}
document.getElementById("orderAmount")
 .addEventListener("input",updateOrderSummary);
document.getElementById("orderType")
 .addEventListener("change",updateOrderSummary);
/* =========================================================
   EXECUTE ORDER
========================================================= */
document.getElementById("executeOrder").addEventListener("click",()=>{
 const amount=Number(document.getElementById("orderAmount").value);
 if(!amount || amount<=0){
  toast("Bitte gib einen Betrag ein.");
  return;
 }
 const asset=ASSETS[selectedAsset];
 const fee=amount*.001;
 if(orderSide==="buy"){
  const total=amount+fee;
  if(total>state.cash){
   toast("Nicht genug virtuelles Guthaben.");
   return;
  }
  const quantity=amount/asset.price;
  if(!state.positions[selectedAsset]){
   state.positions[selectedAsset]={
    quantity:0,
    avgPrice:0,
    invested:0
   };
  }
  const pos=state.positions[selectedAsset];
  const oldValue=pos.quantity*pos.avgPrice;
  pos.quantity+=quantity;
  pos.invested+=amount;
  pos.avgPrice=
   (oldValue+amount)/(pos.quantity);
  state.cash-=total;
  state.trades.unshift({
   id:Date.now(),
   side:"BUY",
   symbol:selectedAsset,
   quantity,
   price:asset.price,
   amount,
   fee,
   date:new Date().toLocaleString("de-DE")
  });
 }else{
  const pos=state.positions[selectedAsset];
  if(!pos || pos.quantity<=0){
   toast("Du besitzt dieses Asset nicht.");
   return;
  }
  const quantity=amount/asset.price;
  if(quantity>pos.quantity){
   toast("Du besitzt nicht genug von diesem Asset.");
   return;
  }
  const received=amount-fee;
  state.cash+=received;
  pos.quantity-=quantity;
  pos.invested=Math.max(
   0,
   pos.invested-quantity*pos.avgPrice
  );
  if(pos.quantity<=0.00000001){
   delete state.positions[selectedAsset];
  }
  state.trades.unshift({
   id:Date.now(),
   side:"SELL",
   symbol:selectedAsset,
   quantity,
   price:asset.price,
   amount,
   fee,
   date:new Date().toLocaleString("de-DE")
  });
 }
 state.fees+=fee;
 addXP(10);
 document.getElementById("orderAmount").value="";
 saveState();
 renderAll();
 toast(
  orderSide==="buy"
   ?"Kauf erfolgreich simuliert!"
   :"Verkauf erfolgreich simuliert!"
 );
});
/* =========================================================
   RISK ORDERS
========================================================= */
document.getElementById("stopLossBtn").addEventListener("click",()=>{
 state.riskOrders++;
 addXP(15);
 saveState();
 renderAll();
 toast("Stop Loss als Lernaktion registriert 🛡");
});
document.getElementById("takeProfitBtn").addEventListener("click",()=>{
 state.riskOrders++;
 addXP(15);
 saveState();
 renderAll();
 toast("Take Profit als Lernaktion registriert 🎯");
});
/* =========================================================
   CHART
========================================================= */
function drawChart(){
 const canvas=document.getElementById("priceChart");
 if(!canvas) return;
 const ctx=canvas.getContext("2d");
 const rect=canvas.getBoundingClientRect();
 const dpr=window.devicePixelRatio||1;
 canvas.width=rect.width*dpr;
 canvas.height=rect.height*dpr;
 ctx.scale(dpr,dpr);
 const width=rect.width;
 const height=rect.height;
 ctx.clearRect(0,0,width,height);
 const data=chartHistory[selectedAsset]||[];
 if(!data.length)return;
 const min=Math.min(...data);
 const max=Math.max(...data);
 const range=max-min||1;
 ctx.strokeStyle="#252a34";
 ctx.lineWidth=1;
 for(let i=1;i<6;i++){
  const y=i*height/6;
  ctx.beginPath();
  ctx.moveTo(0,y);
  ctx.lineTo(width,y);
  ctx.stroke();
 }
 if(chartType==="line"){
  ctx.beginPath();
  data.forEach((value,i)=>{
   const x=i/(data.length-1)*width;
   const y=height-(value-min)/range*height*.85-20;
   if(i===0)ctx.moveTo(x,y);
   else ctx.lineTo(x,y);
  });
  ctx.strokeStyle="#35d07f";
  ctx.lineWidth=2.5;
  ctx.stroke();
 }else{
  const candleWidth=Math.max(3,width/data.length*.55);
  data.forEach((value,i)=>{
   const previous=data[i-1]||value;
   const x=i/(data.length-1)*width;
   const y=height-(value-min)/range*height*.85-20;
   const py=height-(previous-min)/range*height*.85-20;
   ctx.strokeStyle=value>=previous?"#35d07f":"#ff5964";
   ctx.fillStyle=ctx.strokeStyle;
   ctx.beginPath();
   ctx.moveTo(x,Math.min(y,py)-8);
   ctx.lineTo(x,Math.max(y,py)+8);
   ctx.stroke();
   ctx.fillRect(
    x-candleWidth/2,
    Math.min(y,py),
    candleWidth,
    Math.max(2,Math.abs(y-py))
   );
  });
 }
}
/* =========================================================
   PORTFOLIO
========================================================= */
function renderPortfolio(){
 const equity=portfolioValue();
 const pnl=totalPnl();
 const ret=pnl/state.startingCash*100;
 document.getElementById("portfolioEquity").textContent=euro(equity);
 document.getElementById("portfolioCash").textContent=euro(state.cash);
 document.getElementById("portfolioPnl").textContent=euro(pnl);
 document.getElementById("portfolioReturn").textContent=pct(ret);
 const positions=document.getElementById("positions");
 const symbols=Object.keys(state.positions);
 if(!symbols.length){
  positions.innerHTML=
   `<div class="empty">Noch keine offenen Positionen.</div>`;
 }else{
  positions.innerHTML=symbols.map(symbol=>{
   const p=state.positions[symbol];
   const a=ASSETS[symbol];
   const value=p.quantity*a.price;
   const invested=p.quantity*p.avgPrice;
   const pnl=value-invested;
   return `
    <div class="position-row">
      <div class="position-grid">
       <div>
        <strong>${a.name}</strong>
        <div class="asset-symbol">${a.symbol}</div>
       </div>
       <div>
        <small>Menge</small>
        <strong>${num(p.quantity)}</strong>
       </div>
       <div>
        <small>Einstieg</small>
        <strong>${euro(p.avgPrice)}</strong>
       </div>
       <div>
        <small>Wert</small>
        <strong>${euro(value)}</strong>
       </div>
       <div class="${pnl>=0?"change-up":"change-down"}">
        ${euro(pnl)}
       </div>
      </div>
    </div>
   `;
  }).join("");
 }
 const history=document.getElementById("tradeHistory");
 if(!state.trades.length){
  history.innerHTML=
   `<div class="empty">Noch keine Trades.</div>`;
 }else{
  history.innerHTML=state.trades.slice(0,30).map(t=>{
   const a=ASSETS[t.symbol];
   return `
    <div class="history-row">
      <div class="position-grid">
       <div>
        <strong>${t.side==="BUY"?"Kauf":"Verkauf"} ${a.symbol}</strong>
        <div class="asset-symbol">${t.date}</div>
       </div>
       <div>${num(t.quantity)}</div>
       <div>${euro(t.price)}</div>
       <div>${euro(t.amount)}</div>
       <div>${euro(t.fee)} Gebühr</div>
      </div>
    </div>
   `;
  }).join("");
 }
}
/* =========================================================
   LEARNING
========================================================= */
function renderLessons(){
 const container=document.getElementById("lessonsGrid");
 container.innerHTML=LESSONS.map((lesson,index)=>{
  const done=state.completedLessons.includes(lesson.id);
  const unlocked=index===0 ||
   state.completedLessons.includes(LESSONS[index-1].id);
  return `
   <div class="lesson-card">
    <span class="eyebrow">${lesson.tag}</span>
    <h3>${lesson.title}</h3>
    <p>${lesson.text}</p>
    <button
      ${unlocked?"":"disabled"}
      data-lesson="${lesson.id}"
      style="${unlocked?"":"opacity:.4"}"
    >
      ${done?"✓ Abgeschlossen":"Lektion starten"}
    </button>
   </div>
  `;
 }).join("");
 document.getElementById("learnLevel").textContent=getLevel();
 document.getElementById("learnXpBar").style.width=
  xpIntoLevel()+"%";
 document.getElementById("learnXpText").textContent=
  `${state.xp} XP`;
}
document.addEventListener("click",e=>{
 const lessonBtn=e.target.closest("[data-lesson]");
 if(!lessonBtn)return;
 const lesson=LESSONS.find(x=>x.id===lessonBtn.dataset.lesson);
 if(!lesson)return;
 currentLesson=lesson;
 document.getElementById("lessonTag").textContent=lesson.tag;
 document.getElementById("lessonTitle").textContent=lesson.title;
 document.getElementById("lessonText").textContent=lesson.text;
 document.getElementById("lessonQuestion").textContent=lesson.q;
 document.getElementById("lessonAnswers").innerHTML=
  lesson.a.map((answer,i)=>
   `<button class="answer" data-answer="${i}">${answer}</button>`
  ).join("");
 document.getElementById("lessonResult").innerHTML="";
 document.getElementById("lessonModal")
  .classList.remove("hidden");
});
document.getElementById("closeLesson").addEventListener("click",()=>{
 document.getElementById("lessonModal").classList.add("hidden");
});
document.addEventListener("click",e=>{
 const answer=e.target.closest("[data-answer]");
 if(!answer||!currentLesson)return;
 const selected=Number(answer.dataset.answer);
 if(selected===currentLesson.correct){
  document.getElementById("lessonResult").innerHTML=
   `<div class="change-up">✓ Richtig! +25 XP</div>`;
  if(!state.completedLessons.includes(currentLesson.id)){
   state.completedLessons.push(currentLesson.id);
   addXP(25);
   saveState();
   renderAll();
  }
 }else{
  document.getElementById("lessonResult").innerHTML=
   `<div class="change-down">✕ Nicht ganz. Versuch es noch einmal.</div>`;
 }
});
/* =========================================================
   MISSIONS
========================================================= */
function checkMissions(){
 MISSIONS.forEach(mission=>{
  if(
   mission.check(state) &&
   !state.claimedMissions.includes(mission.id)
  ){
   state.claimedMissions.push(mission.id);
   state.xp+=mission.xp;
   toast(`Mission abgeschlossen: +${mission.xp} XP`);
  }
 });
}
function renderHomeMissions(){
 checkMissions();
 const container=document.getElementById("homeMissions");
 container.innerHTML=MISSIONS.slice(0,3).map(m=>{
  const done=m.check(state);
  return `
   <div class="mission">
    <div>
     <h3>${m.title}</h3>
     <p>${m.text}</p>
    </div>
    <span class="mission-status ${done?"done":"waiting"}">
      ${done?"✓ Fertig":"+"+m.xp+" XP"}
    </span>
   </div>
  `;
 }).join("");
}
function renderMissions(){
 checkMissions();
 document.getElementById("missionsList").innerHTML=
 MISSIONS.map(m=>{
  const done=m.check(state);
  return `
   <div class="panel mission">
    <div>
     <h3>${m.title}</h3>
     <p>${m.text}</p>
    </div>
    <span class="mission-status ${done?"done":"waiting"}">
      ${done?"✓ Abgeschlossen":"+"+m.xp+" XP"}
    </span>
   </div>
  `;
 }).join("");
 document.getElementById("achievements").innerHTML=
 ACH.map(a=>{
  const unlocked=a[3](state);
  return `
   <div class="badge ${unlocked?"unlocked":""}">
    <span>${a[1]}</span>
    <strong>${a[2]}</strong>
   </div>
  `;
 }).join("");
 saveState();
}
/* =========================================================
   JOURNAL
========================================================= */
function renderJournal(){
 const select=document.getElementById("journalAsset");
 select.innerHTML=Object.keys(ASSETS).map(symbol=>
  `<option value="${symbol}">${ASSETS[symbol].name} (${symbol})</option>`
 ).join("");
 const container=document.getElementById("journalEntries");
 if(!state.journal.length){
  container.innerHTML=
   `<div class="panel empty">Noch keine Journal-Einträge.</div>`;
  return;
 }
 container.innerHTML=state.journal.map(entry=>{
  const a=ASSETS[entry.symbol];
  return `
   <div class="panel journal-entry">
    <strong>${a.name}</strong>
    <div class="asset-symbol">
      ${entry.date}
    </div>
    <p style="margin-top:10px">
      ${escapeHTML(entry.text)}
    </p>
   </div>
  `;
 }).join("");
}
document.getElementById("saveJournal").addEventListener("click",()=>{
 const symbol=document.getElementById("journalAsset").value;
 const text=document.getElementById("journalText").value.trim();
 if(!text){
  toast("Schreibe zuerst deine Trade-Idee.");
  return;
 }
 state.journal.unshift({
  symbol,
  text,
  date:new Date().toLocaleString("de-DE")
 });
 addXP(10);
 document.getElementById("journalText").value="";
 saveState();
 renderJournal();
 renderAll();
 toast("Journal-Eintrag gespeichert 📓");
});
function escapeHTML(text){
 return text
  .replaceAll("&","&amp;")
  .replaceAll("<","&lt;")
  .replaceAll(">","&gt;")
  .replaceAll('"',"&quot;")
  .replaceAll("'","&#039;");
}
/* =========================================================
   XP
========================================================= */
function addXP(amount){
 state.xp+=amount;
 saveState();
}
/* =========================================================
   RESET
========================================================= */
document.getElementById("resetBtn").addEventListener("click",()=>{
 const ok=confirm(
  "Wirklich den kompletten TradeQuest-Spielstand zurücksetzen?"
 );
 if(!ok)return;
 state=defaultState();
 saveState();
 renderAll();
 toast("Spielstand wurde zurückgesetzt.");
});
/* =========================================================
   RENDER EVERYTHING
========================================================= */
function renderAll(){
 renderHome();
 renderMarkets();
 updateTradeScreen();
 renderPortfolio();
 renderLessons();
 renderMissions();
 renderJournal();
 updateOrderButton();
}
window.addEventListener("resize",()=>{
 drawChart();
});
/* =========================================================
   START
========================================================= */
renderAll();
showPage("home");
``