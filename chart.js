let selectedCoin = "BTC";

let chartData = [];

let chartCanvas =
document.getElementById("priceChart");


function drawChart(){

if(!chartCanvas)
return;


const ctx =
chartCanvas.getContext("2d");

const width =
chartCanvas.clientWidth;

const height =
chartCanvas.clientHeight;

const ratio =
window.devicePixelRatio || 1;


chartCanvas.width =
width * ratio;

chartCanvas.height =
height * ratio;


ctx.setTransform(
ratio,
0,
0,
ratio,
0,
0
);


ctx.clearRect(
0,
0,
width,
height
);


if(chartData.length < 2)
return;


const min =
Math.min(...chartData);

const max =
Math.max(...chartData);

const range =
max - min || 1;


ctx.strokeStyle =
"#1c2737";

ctx.lineWidth=1;


for(let i=1;i<5;i++){

const y =
(i/5)*height;

ctx.beginPath();

ctx.moveTo(0,y);

ctx.lineTo(width,y);

ctx.stroke();

}


ctx.beginPath();


chartData.forEach(
(value,index)=>{

const x =
(index/(chartData.length-1))*width;

const y =
height -
((value-min)/range)*
(height-30)
-15;


if(index===0)
ctx.moveTo(x,y);
else
ctx.lineTo(x,y);

}
);


ctx.strokeStyle =
"#00d084";

ctx.lineWidth=3;

ctx.stroke();


const last =
chartData[chartData.length-1];


const lastX =
width;

const lastY =
height -
((last-min)/range)*
(height-30)
-15;


ctx.beginPath();

ctx.arc(
lastX,
lastY,
4,
0,
Math.PI*2
);

ctx.fillStyle =
"#00d084";

ctx.fill();

}


function addChartPrice(price){

if(!price)
return;


chartData.push(price);


if(chartData.length > 150)
chartData.shift();


drawChart();

}


window.addEventListener(
"resize",
drawChart
);