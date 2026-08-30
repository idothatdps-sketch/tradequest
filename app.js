let lastPriceUpdate = 0;


async function updatePrices(){

try{

const response =
await fetch(
CONFIG.API_URL
);


if(!response.ok)
throw new Error(
"API error"
);


const data =
await response.json();


prices.BTC =
data.bitcoin.eur;

prices.ETH =
data.ethereum.eur;

prices.SOL =
data.solana.eur;


document.getElementById(
"BTCprice"
).innerText =
euro(prices.BTC);


document.getElementById(
"ETHprice"
).innerText =
euro(prices.ETH);


document.getElementById(
"SOLprice"
).innerText =
euro(prices.SOL);


document.getElementById(
"currentPrice"
).innerText =
euro(
prices[selectedCoin]
);


document.getElementById(
"selectedTradePrice"
).innerText =
euro(
prices[selectedCoin]
);


addChartPrice(
prices[selectedCoin]
);


updateUI();


lastPriceUpdate =
Date.now();


}catch(error){

console.log(
"Live-Kurse konnten nicht geladen werden.",
error
);

}

}


function selectCoin(coin){

selectedCoin =
coin;


document
.querySelectorAll(".market")
.forEach(
market=>{
market.classList.remove(
"active"
);
}
);


const selected =
document.querySelector(
`.market[data-coin="${coin}"]`
);


if(selected)
selected.classList.add(
"active"
);


document.getElementById(
"selectedSymbol"
).innerText =
coin;


document.getElementById(
"selectedName"
).innerText =
CONFIG.COINS[coin].name;


document.getElementById(
"chartTitle"
).innerText =
CONFIG.COINS[coin].name;


document.getElementById(
"currentPrice"
).innerText =
prices[coin]
? euro(prices[coin])
:"Laden...";


document.getElementById(
"selectedTradePrice"
).innerText =
prices[coin]
? euro(prices[coin])
:"Laden...";


chartData=[];


if(prices[coin])
addChartPrice(
prices[coin]
);


updateTradePreview();

}


function setupEvents(){

document
.querySelectorAll(".market")
.forEach(
market=>{

market.addEventListener(
"click",
()=>{

selectCoin(
market.dataset.coin
);

}
);

}
);


document
.querySelectorAll(
".quick-buttons button"
)
.forEach(
button=>{

button.addEventListener(
"click",
()=>{

document.getElementById(
"tradeAmount"
).value =
button.dataset.amount;

updateTradePreview();

}
);

}
);


document
.getElementById(
"tradeAmount"
)
.addEventListener(
"input",
updateTradePreview
);


document
.getElementById(
"buyButton"
)
.addEventListener(
"click",
buy
);


document
.getElementById(
"sellButton"
)
.addEventListener(
"click",
sell
);


document
.getElementById(
"resetButton"
)
.addEventListener(
"click",
resetGame
);


document
.getElementById(
"chartRange"
)
.addEventListener(
"change",
()=>{
chartData=[];
}
);

}


function resetGame(){

const confirmed =
confirm(
"Willst du deinen kompletten TradeQuest-Spielstand löschen?"
);


if(!confirmed)
return;


state={

cash:
CONFIG.STARTING_CASH,

portfolio:{
BTC:0,
ETH:0,
SOL:0
},

invested:0,

xp:0,

trades:[],

completedLessons:[]

};


saveState();

updateUI();

alert(
"Spielstand wurde zurückgesetzt."
);

}


async function init(){

setupEvents();

updateUI();

await updatePrices();


setInterval(
updatePrices,
30000
);

}


init();