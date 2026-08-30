const CONFIG = {

STARTING_CASH: 1000,

FEE_RATE: 0.001,

API_URL:
"https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=eur",

COINS: {

BTC:{
name:"Bitcoin",
id:"bitcoin"
},

ETH:{
name:"Ethereum",
id:"ethereum"
},

SOL:{
name:"Solana",
id:"solana"
}

}

};


let prices = {

BTC:0,
ETH:0,
SOL:0

};


let state =
JSON.parse(
localStorage.getItem("tradequest_state")
) || {

cash:CONFIG.STARTING_CASH,

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


function saveState(){

localStorage.setItem(
"tradequest_state",
JSON.stringify(state)
);

}


function euro(value){

return new Intl.NumberFormat(
"de-DE",
{
style:"currency",
currency:"EUR"
}
).format(value);

}


function number(value){

return new Intl.NumberFormat(
"de-DE",
{
maximumFractionDigits:8
}
).format(value);

}


function getLevel(){

return Math.floor(state.xp / 100) + 1;

}


function getLevelXP(){

return state.xp % 100;

}