const ASSETS={
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
const LESSONS=[
 {id:"l1",title:"Trading-Grundlagen",tag:"LEVEL 1",text:"Was sind Assets, Börsen, Broker und Orders? Lerne die wichtigsten Begriffe.",q:"Was bedeutet eine Market Order?",a:["Sie wird zum aktuell verfügbaren Preis ausgeführt.","Sie wartet immer bis morgen.","Sie ist ein Sparplan."],correct:0},
 {id:"l2",title:"Candlesticks lesen",tag:"LEVEL 2",text:"Verstehe Open, High, Low und Close und erkenne einfache Trends.",q:"Was zeigt eine grüne Kerze typischerweise?",a:["Der Schlusskurs liegt über dem Eröffnungskurs.","Der Markt war geschlossen.","Es gab keine Trades."],correct:0},
 {id:"l3",title:"Orders verstehen",tag:"LEVEL 3",text:"Market, Limit, Stop Loss und Take Profit haben unterschiedliche Aufgaben.",q:"Wofür wird ein Stop Loss genutzt?",a:["Um Verluste zu begrenzen.","Um garantiert Gewinn zu machen.","Um Gebühren zu vermeiden."],correct:0},
 {id:"l4",title:"Risiko-Management",tag:"LEVEL 4",text:"Positionsgröße, Risiko pro Trade, Risk/Reward und Diversifikation.",q:"Was ist meist sinnvoller?",a:["Das gesamte Konto auf einen Trade setzen.","Das Risiko pro Trade begrenzen.","Stop Loss nie verwenden."],correct:1},
 {id:"l5",title:"Strategien",tag:"LEVEL 5",text:"Trend Following, Breakout, DCA und Swing Trading kennenlernen.",q:"Was bedeutet DCA?",a:["Regelmäßig investieren, unabhängig vom kurzfristigen Kurs.","Nur am Tageshoch kaufen.","Immer Short gehen."],correct:0},
 {id:"l6",title:"Trading-Journal",tag:"LEVEL 6",text:"Dokumentiere deine Entscheidungen und analysiere wiederkehrende Fehler.",q:"Warum ein Journal führen?",a:["Um Entscheidungen zu reflektieren.","Um Gewinne zu garantieren.","Um Gebühren zu umgehen."],correct:0}
];
const MISSIONS=[
 {id:"m1",title:"Erster Trade",text:"Platziere deinen ersten simulierten Trade.",xp:50,check:s=>s.trades.length>=1},
 {id:"m2",title:"Lernstarter",text:"Schließe eine Lektion ab.",xp:30,check:s=>s.completedLessons.length>=1},
 {id:"m3",title:"10 Trades",text:"Führe zehn simulierte Trades aus.",xp:100,check:s=>s.trades.length>=10},
 {id:"m4",title:"Risikoprofi",text:"Verwende bei einem Trade Stop Loss oder Take Profit.",xp:100,check:s=>s.riskOrders>=1},
 {id:"m5",title:"Trader-Level 5",text:"Erreiche Level 5.",xp:200,check:s=>level()>=5}
];
const ACH=[
 ["first","🥇","Erster Trade",s=>s.trades.length>=1],
 ["ten","🔥","10 Trades",s=>s.trades.length>=10],
 ["lesson","📚","Erste Lektion",s=>s.completedLessons.length>=1],
 ["risk","🛡️","Risikoprofi",s=>s.riskOrders>=1],
 ["level5","⭐","Level 5",s=>level()>=5],
 ["journal","📓","Journalist",s=>s.journal.length>=3]
];
const NEWS=[
 ["BTC","Bitcoin bewegt sich stark — Simulation: Volatilität erhöht.","high"],
 ["NVDA","Technologie-Aktien stehen im Fokus des Marktes.","medium"],
 ["GOLD","Gold zeigt eine ruhige Marktphase.","low"],
 ["EURUSD","Der EUR/USD-Markt bewegt sich seitwärts.","low"]
];
const KEY="tradequest_complete_v2";
const fresh=()=>({cash:10000,start:10000,positions:{},openOrders:[],trades:[],realized:0,xp:0,completedLessons:[],missions:[],riskOrders:0,journal:[],news:NEWS.map((n,i)=>({id:i,symbol:n[0],title:n[1],impact:n[2],time:Date.now()-i*3600000}))});
let state=JSON.parse(localStorage.getItem(KEY)||"null")||fresh();
let prices={},history={},selected="BTC",side="buy",filter="all";
Object.entries(ASSETS).forEach(([k,a])=>{prices[k]=a.price;history[k]=Array.from({length:100},()=>a.price*(1+(Math.random()-.5)*.05))});
const money=n=>new Intl.NumberFormat("de-DE",{style:"currency",currency:"EUR",maximumFractionDigits:2}).format(n);
const num=(n,d=4)=>Number(n).toLocaleString("de-DE",{maximumFractionDigits:d});
const pct=n=>(n>=0?"+":"")+n.toFixed(2)+"%";
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function level(){return Math.floor(state.xp/100)+1}
function xpInto(){return state.xp%100}
function equity(){return state.cash+Object.entries(state.positions).reduce((v,[k,p])=>v+positionValue(k,p),0)}
function positionValue(k,p){return Math.abs(p.qty)*prices[k]}
function unrealized(){return Object.entries(state.positions).reduce((v,[k,p])=>v+(prices[k]-p.avg)*p.qty,0)}
function winRate(){let closed=state.trades.filter(t=>t.realized!==null&&t.realized!==undefined);if(!closed.length)return null;return closed.filter(t=>t.realized>0).length/closed.length*100}
function toast(msg){const e=document.getElementById("toast");e.textContent=msg;e.style.opacity=1;e.style.transform="translate(-50%,0)";clearTimeout(window._toast);window._toast=setTimeout(()=>{e.style.opacity=0;e.style.transform="translate(-50%,20px)"},1800)}
function go(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("active",b.dataset.go===id));scrollTo({top:0,behavior:"smooth"});renderAll()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b)go(b.dataset.go)});
function renderAll(){renderHome();renderMarkets();renderTrade();renderPortfolio();renderLessons();renderMissions();renderNews();renderJournal();renderProfile()}
function renderHome(){let eq=equity(),g=eq-state.start,w=winRate();set("heroEquity",money(eq));set("heroPnl",(g>=0?"+":"")+money(g));cls("heroPnl",g>=0);set("homeLevel",level());set("homeXp",`${xpInto()} / 100 XP`);set("homeTrades",state.trades.length);set("homeMissions",state.missions.length);set("homeWinRate",w===null?"—":w.toFixed(0)+"%");set("homeBtcPrice",money(prices.BTC));let c=(prices.BTC/history.BTC.at(-20)-1)*100;set("homeBtcChange",pct(c));cls("homeBtcChange",c>=0);let prog=Math.min(100,state.completedLessons.length/LESSONS.length*100);set("homeLearning",Math.round(prog)+" %");document.getElementById("homeProgress").style.width=prog+"%";let next=MISSIONS.find(m=>!state.missions.includes(m.id));set("nextMission",next?next.title:"Alle Missionen erledigt 🎉")}
function renderMarkets(){let q=(document.getElementById("marketSearch")?.value||"").toLowerCase();let list=Object.entries(ASSETS).filter(([k,a])=>(filter==="all"||a.type===filter)&&(!q||a.name.toLowerCase().includes(q)||a.symbol.toLowerCase().includes(q)));document.getElementById("marketGrid").innerHTML=list.map(([k,a])=>{let c=(prices[k]/history[k].at(-20)-1)*100;return `<button class="card market" data-asset="${k}"><div class="market-left"><span class="coin">${a.icon}</span><span><h3>${a.name}</h3><small>${a.symbol} · ${a.type}</small></span></div><div class="market-right"><b>${money(prices[k])}</b><span class="${c>=0?"positive":"negative"}">${pct(c)}</span></div></button>`}).join("")||`<div class="card empty">Kein Asset gefunden.</div>`}
function renderTrade(){let a=ASSETS[selected],c=(prices[selected]/history[selected].at(-20)-1)*100;set("tradeIcon",a.icon);set("tradeAsset",a.name);set("tradeSymbol",a.symbol);set("tradePrice",money(prices[selected]));set("tradeChange",pct(c));cls("tradeChange",c>=0);set("tradeCash",money(state.cash));set("qtyUnit",a.symbol);set("orderPrice",money(prices[selected]));let q=Number(document.getElementById("qty")?.value||0),v=q*prices[selected],fee=v*.001;set("orderFee",money(fee));set("orderTotal",money(v+fee));set("executeBtn",(side==="buy"?"Market Buy":"Market Sell"));drawChart()}
function renderPortfolio(){set("equity",money(equity()));set("cash",money(state.cash));set("unrealized",money(unrealized()));set("returnPct",pct((equity()-state.start)/state.start*100));let p=Object.entries(state.positions);document.getElementById("positions").innerHTML=p.length?`<div class="table-row head"><span>Asset</span><span>Seite</span><span>Menge</span><span>Wert</span><span>P&L</span></div>`+p.map(([k,x])=>{let pl=(prices[k]-x.avg)*x.qty;return `<div class="table-row"><span><b>${ASSETS[k].symbol}</b><br><small>${ASSETS[k].name}</small></span><span class="${x.qty>=0?"positive":"negative"}">${x.qty>=0?"LONG":"SHORT"}</span><span>${num(Math.abs(x.qty),6)}</span><span>${money(positionValue(k,x))}</span><span class="${pl>=0?"positive":"negative"}">${money(pl)}</span></div>`}).join(""):`<div class="empty">Noch keine offenen Positionen. Starte einen simulierten Trade.</div>`;document.getElementById("openOrders").innerHTML=state.openOrders.length?state.openOrders.map((o,i)=>`<div class="table-row"><span>${ASSETS[o.symbol].symbol}</span><span>${o.side.toUpperCase()}</span><span>${o.type.toUpperCase()}</span><span>${money(o.trigger)}</span><button class="action" data-cancel="${i}">Stornieren</button></div>`).join(""):`<div class="empty">Keine offenen Orders.</div>`;document.getElementById("tradeHistory").innerHTML=state.trades.length?state.trades.slice(0,30).map(t=>`<div class="table-row"><span><b>${t.symbol}</b><br><small>${new Date(t.time).toLocaleString("de-DE")}</small></span><span class="${t.side==="buy"?"positive":"negative"}">${t.side==="buy"?"BUY":"SELL"}</span><span>${num(t.qty,6)}</span><span>${money(t.price)}</span><span class="${(t.realized||0)>=0?"positive":"negative"}">${t.realized===null?"—":money(t.realized)}</span></div>`).join(""):`<div class="empty">Noch keine Trades.</div>`}
function renderLessons(){document.getElementById("lessonGrid").innerHTML=LESSONS.map((l,i)=>{let done=state.completedLessons.includes(l.id);return `<article class="card lesson ${done?"done":""}"><span class="tag">${l.tag}</span><h3>${l.title}</h3><p>${l.text}</p>${done?`<button class="secondary" disabled>✓ Abgeschlossen</button>`:`<button class="lessonOpen primary" data-lesson="${l.id}">Lektion starten · +20 XP</button><div class="quiz hidden" id="quiz-${l.id}"><b>${l.q}</b>${l.a.map((x,j)=>`<button class="secondary quizAnswer" data-lesson="${l.id}" data-answer="${j}">${x}</button>`).join("")}</div>`}</article>`}).join("")}
function renderMissions(){document.getElementById("missionGrid").innerHTML=MISSIONS.map(m=>{let d=state.missions.includes(m.id);return `<article class="card lesson ${d?"done":""}"><span class="tag">MISSION</span><h3>${m.title}</h3><p>${m.text}</p><b>${d?"✓ Erledigt":"+"+m.xp+" XP"}</b></article>`}).join("")}
function renderNews(){document.getElementById("newsGrid").innerHTML=state.news.map(n=>`<article class="card news"><span class="impact">${n.impact}</span><small>${n.symbol}</small><h3>${n.title}</h3><span>${new Date(n.time).toLocaleString("de-DE")}</span><button class="secondary" data-news="${n.symbol}" style="margin-top:16px">Markt öffnen</button></article>`).join("")}
function renderJournal(){document.getElementById("journalList").innerHTML=state.journal.slice().reverse().map(n=>`<div class="card journal-entry"><small>${new Date(n.time).toLocaleString("de-DE")}</small><p>${escapeHtml(n.text)}</p></div>`).join("")}
function renderProfile(){set("profileLevel",level());set("profileXp",state.xp+" XP");document.getElementById("profileProgress").style.width=xpInto()+"%";document.getElementById("achievementGrid").innerHTML=ACH.map(a=>{let d=a[3](state);return `<div class="achievement ${d?"":"locked"}"><div>${a[1]}</div><b>${a[2]}</b><small>${d?"Freigeschaltet":"Noch gesperrt"}</small></div>`}).join("")}
function execute(sideOverride=side,forceType=null,forcePrice=null){let q=Number(document.getElementById("qty").value),type=forceType||document.getElementById("orderType").value,trigger=Number(document.getElementById("triggerPrice").value);if(!q||q<=0)return msg("Gib eine Menge ein.");let p=forcePrice||prices[selected],gross=q*p,fee=gross*.001; if(type!=="market"&&!forcePrice){if(!trigger||trigger<=0)return msg("Gib einen gültigen Trigger-Preis ein.");state.openOrders.push({symbol:selected,side:sideOverride,type,qty:q,trigger,created:Date.now()});if(type==="stop"||type==="stoplimit")state.riskOrders++;save();renderAll();toast("Order wurde als offene Order gespeichert.");return} if(sideOverride==="buy"){if(state.cash<gross+fee)return msg("Nicht genug virtuelles Guthaben.");state.cash-=gross+fee;applyPosition(selected,q,p,1)}else{let pos=state.positions[selected];if(pos&&pos.qty>0){if(pos.qty<q)return msg("Nicht genug Bestand.");state.cash+=gross-fee;applyPosition(selected,q,p,-1)}else{if(state.cash<gross*.5+fee)return msg("Nicht genug virtuelle Margin für den Short.");state.cash-=fee;applyPosition(selected,q,p,-1)}}state.trades.unshift({symbol:selected,side:sideOverride,type,qty:q,price:p,time:Date.now(),realized:null});state.xp+=10;save();checkMissions();renderAll();toast(`${sideOverride==="buy"?"Kauf":"Verkauf"} ausgeführt · +10 XP`)}
function applyPosition(k,q,p,dir){let pos=state.positions[k];if(!pos){state.positions[k]={qty:q*dir,avg:p,stop:null,target:null};return}if(Math.sign(pos.qty)===dir){let a=Math.abs(pos.qty);pos.avg=(a*pos.avg+q*p)/(a+q);pos.qty+=q*dir;return}let close=Math.min(Math.abs(pos.qty),q),direction=pos.qty>0?1:-1,real=(p-pos.avg)*close*direction;state.realized+=real;let t=state.trades.find(x=>x.symbol===k&&x.realized===null);if(t)t.realized=real;pos.qty+=q*dir;if(Math.abs(pos.qty)<1e-10)delete state.positions[k];else if(Math.sign(pos.qty)!==direction)pos.avg=p}
function checkOpenOrders(){let keep=[];for(const o of state.openOrders){let p=prices[o.symbol],hit=o.side==="buy"?(o.type==="limit"?p<=o.trigger:p>=o.trigger):(o.type==="limit"?p>=o.trigger:p<=o.trigger);if(hit)executeOpen(o,p);else keep.push(o)}state.openOrders=keep}
function executeOpen(o,p){let q=o.qty,gross=q*p,fee=gross*.001;if(o.side==="buy"){if(state.cash<gross+fee){toast("Offene Order konnte nicht ausgeführt werden.");return}state.cash-=gross+fee;applyPosition(o.symbol,q,p,1)}else{let pos=state.positions[o.symbol];if(pos&&pos.qty>=q){state.cash+=gross-fee;applyPosition(o.symbol,q,p,-1)}else{state.cash-=fee;applyPosition(o.symbol,q,p,-1)}}state.trades.unshift({symbol:o.symbol,side:o.side,type:o.type,qty:q,price:p,time:Date.now(),realized:null});state.xp+=5;toast(`${o.type.toUpperCase()} Order ausgeführt`)}
function checkRisk(){for(const [k,p] of Object.entries(state.positions)){if(!p.stop&&!p.target)continue;let price=prices[k],long=p.qty>0;if((p.stop&&(long?price<=p.stop:price>=p.stop))||(p.target&&(long?price>=p.target:price<=p.target))){let side2=long?"sell":"buy";execute(side2,"market",price);}}}
function checkMissions(){MISSIONS.forEach(m=>{if(!state.missions.includes(m.id)&&m.check(state)){state.missions.push(m.id);state.xp+=m.xp;toast(`Mission abgeschlossen: ${m.title} · +${m.xp} XP`)}});save()}
function checkAchievements(){save()}
function msg(t){document.getElementById("orderMsg").textContent=t;toast(t)}
function drawChart(){let c=document.getElementById("chart");if(!c)return;let r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;let x=c.getContext("2d");x.scale(d,d);let a=history[selected],min=Math.min(...a),max=Math.max(...a);x.strokeStyle="#202b36";x.lineWidth=1;for(let i=1;i<5;i++){x.beginPath();x.moveTo(0,i*r.height/5);x.lineTo(r.width,i*r.height/5);x.stroke()}x.beginPath();a.forEach((v,i)=>{let px=i/(a.length-1)*r.width,py=r.height-12-(v-min)/(max-min||1)*(r.height-24);i?x.lineTo(px,py):x.moveTo(px,py)});x.strokeStyle="#dfff55";x.lineWidth=2;x.stroke()}
function set(id,v){let e=document.getElementById(id);if(e)e.textContent=v}
function cls(id,positive){let e=document.getElementById(id);if(e)e.className=positive?"positive":"negative"}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

document.addEventListener("click",e=>{
 let a=e.target.closest("[data-asset]");if(a){selected=a.dataset.asset;go("trade");return}
 let f=e.target.closest("[data-filter]");if(f){filter=f.dataset.filter;document.querySelectorAll("#marketFilter button").forEach(x=>x.classList.toggle("active",x===f));renderMarkets();return}
 let l=e.target.closest("[data-lesson]");if(l&&!e.target.classList.contains("quizAnswer")){document.getElementById("quiz-"+l.dataset.lesson)?.classList.remove("hidden");return}
 let qa=e.target.closest(".quizAnswer");if(qa){let lesson=LESSONS.find(x=>x.id===qa.dataset.lesson);if(Number(qa.dataset.answer)===lesson.correct){if(!state.completedLessons.includes(lesson.id)){state.completedLessons.push(lesson.id);state.xp+=20;save();checkMissions();renderAll();toast("Richtig! +20 XP 🎉")}}else toast("Noch nicht richtig — versuche es erneut.");return}
 let c=e.target.closest("[data-cancel]");if(c){state.openOrders.splice(Number(c.dataset.cancel),1);save();renderPortfolio();toast("Order storniert");return}
 let n=e.target.closest("[data-news]");if(n){selected=n.dataset.news;go("trade");return}
});
document.getElementById("marketSearch").addEventListener("input",renderMarkets);
document.getElementById("buySide").onclick=()=>{side="buy";document.getElementById("buySide").classList.add("active");document.getElementById("sellSide").classList.remove("active");renderTrade()};
document.getElementById("sellSide").onclick=()=>{side="sell";document.getElementById("sellSide").classList.add("active");document.getElementById("buySide").classList.remove("active");renderTrade()};
document.getElementById("qty").addEventListener("input",renderTrade);
document.getElementById("orderType").addEventListener("change",()=>{document.getElementById("priceInputs").classList.toggle("hidden",document.getElementById("orderType").value==="market")});
document.getElementById("executeBtn").onclick=()=>execute();
document.getElementById("shortBtn").onclick=()=>{side="sell";document.getElementById("sellSide").click();execute("sell")};
document.getElementById("saveJournal").onclick=()=>{let t=document.getElementById("journalText").value.trim();if(!t)return toast("Schreibe zuerst eine Notiz.");state.journal.push({text:t,time:Date.now()});state.xp+=10;document.getElementById("journalText").value="";save();renderAll();toast("Journal gespeichert · +10 XP")};
document.getElementById("resetBtn").onclick=()=>{if(confirm("Wirklich alle TradeQuest-Daten löschen?")){localStorage.removeItem(KEY);location.reload()}};
window.addEventListener("resize",drawChart);

setInterval(()=>{
 Object.entries(ASSETS).forEach(([k,a])=>{let drift=(Math.random()-.495)*a.vol;prices[k]=Math.max(.0001,prices[k]*(1+drift));history[k].push(prices[k]);if(history[k].length>100)history[k].shift()});
 checkOpenOrders(); renderAll();
},1000);
renderAll();