function buy(){

const amount =
Number(
document.getElementById(
"tradeAmount"
).value
);


if(!amount || amount<=0){

alert(
"Bitte gib einen gültigen Betrag ein."
);

return;

}


if(!prices[selectedCoin]){

alert(
"Der Live-Kurs ist noch nicht verfügbar."
);

return;

}


const fee =
amount * CONFIG.FEE_RATE;

const totalCost =
amount + fee;


if(totalCost > state.cash){

alert(
"Du hast nicht genug Spielgeld."
);

return;

}


const quantity =
amount / prices[selectedCoin];


state.cash -= totalCost;

state.portfolio[selectedCoin] += quantity;

state.invested += amount;


state.xp += 10;


state.trades.unshift({

type:"BUY",

coin:selectedCoin,

amount:amount,

fee:fee,

quantity:quantity,

price:prices[selectedCoin],

date:new Date().toLocaleString(
"de-DE"
)

});


saveState();

updateUI();

document.getElementById(
"tradeAmount"
).value="";


}


function sell(){

const amount =
Number(
document.getElementById(
"tradeAmount"
).value
);


if(!amount || amount<=0){

alert(
"Bitte gib einen gültigen Betrag ein."
);

return;

}


if(!prices[selectedCoin]){

alert(
"Der Live-Kurs ist noch nicht verfügbar."
);

return;

}


const quantity =
amount / prices[selectedCoin];


if(
quantity >
state.portfolio[selectedCoin]
){

alert(
"Du besitzt nicht genug "+
selectedCoin+"."
);

return;

}


const fee =
amount * CONFIG.FEE_RATE;

const received =
amount - fee;


state.portfolio[selectedCoin]
-= quantity;

state.cash += received;


state.xp += 15;


state.trades.unshift({

type:"SELL",

coin:selectedCoin,

amount:amount,

fee:fee,

quantity:quantity,

price:prices[selectedCoin],

date:new Date().toLocaleString(
"de-DE"
)

});


saveState();

updateUI();

document.getElementById(
"tradeAmount"
).value="";

}


function updateTradePreview(){

const amount =
Number(
document.getElementById(
"tradeAmount"
).value
);


const price =
prices[selectedCoin];


document.getElementById(
"previewPrice"
).innerText =
price ? euro(price) : "—";


document.getElementById(
"previewQuantity"
).innerText =
amount && price
? number(amount/price)
: "—";

}


function updatePortfolio(){

const list =
document.getElementById(
"portfolioList"
);


let html="";

let count=0;


Object.keys(state.portfolio)
.forEach(coin=>{

const quantity =
state.portfolio[coin];

if(quantity <= 0)
return;


count++;


const value =
quantity * prices[coin];


html += `

<div class="portfolio-item">

<div class="portfolio-left">

<div class="portfolio-symbol">
${coin}
</div>

<div>

<strong>
${CONFIG.COINS[coin].name}
</strong>

<small>
${number(quantity)} ${coin}
</small>

</div>

</div>

<strong>
${euro(value)}
</strong>

</div>

`;

});


if(!html){

html =
'<div class="empty">Noch keine Positionen.</div>';

}


list.innerHTML=html;


document.getElementById(
"portfolioCount"
).innerText =
count+" Positionen";

}


function updateHistory(){

const box =
document.getElementById(
"history"
);


if(!state.trades.length){

box.innerHTML =
'<div class="empty">Noch keine Trades.</div>';

return;

}


box.innerHTML =
state.trades
.slice(0,30)
.map(trade=>{

const isBuy =
trade.type === "BUY";


return `

<div class="history-item">

<strong class="${
isBuy
?"history-buy"
:"history-sell"
}">

${isBuy?"🟢 KAUF":"🔴 VERKAUF"}
· ${trade.coin}

</strong>

<br>

${euro(trade.amount)}

· ${number(trade.quantity)}
${trade.coin}

<small>

Kurs:
${euro(trade.price)}

· Gebühr:
${euro(trade.fee)}

<br>

${trade.date}

</small>

</div>

`;

})
.join("");

}


function updateUI(){

const cryptoValue =

state.portfolio.BTC *
prices.BTC +

state.portfolio.ETH *
prices.ETH +

state.portfolio.SOL *
prices.SOL;


const totalValue =
state.cash + cryptoValue;


const profit =
totalValue -
CONFIG.STARTING_CASH;


const performance =
(profit /
CONFIG.STARTING_CASH) *
100;


document.getElementById(
"totalValue"
).innerText =
euro(totalValue);


document.getElementById(
"cash"
).innerText =
euro(state.cash);


document.getElementById(
"invested"
).innerText =
euro(state.invested);


document.getElementById(
"profit"
).innerText =
euro(profit);


document.getElementById(
"performance"
).innerText =
performance.toFixed(2)+" %";


document.getElementById(
"xpText"
).innerText =
state.xp+" XP";


const level =
getLevel();


document.getElementById(
"level"
).innerText =
level;


document.getElementById(
"headerLevel"
).innerText =
level;


document.getElementById(
"xpFill"
).style.width =
getLevelXP()+"%";


document.getElementById(
"xpNext"
).innerText =
(100-getLevelXP())+
" XP bis Level "+(level+1);


document.getElementById(
"btcHolding"
).innerText =
number(state.portfolio.BTC);


document.getElementById(
"ethHolding"
).innerText =
number(state.portfolio.ETH);


document.getElementById(
"solHolding"
).innerText =
number(state.portfolio.SOL);


updatePortfolio();

updateHistory();

updateMissions();

updateTradePreview();

}