const quizzes = [

{

question:
"Was bedeutet Trading?",

answers:[

"Nur Bitcoin kaufen",

"Vermögenswerte kaufen und verkaufen, um von Preisbewegungen zu profitieren",

"Immer Gewinn machen"

],

correct:1

},

{

question:
"Warum ist Risikomanagement wichtig?",

answers:[

"Weil Märkte sich immer bewegen",

"Weil Verluste möglich sind",

"Weil man dadurch garantiert gewinnt"

],

correct:1

},

{

question:
"Was sollte man vor einem Trade überlegen?",

answers:[

"Wie viel Risiko man eingehen möchte",

"Alles Geld investieren",

"Nur auf Social Media schauen"

],

correct:0

}

];


function startQuiz(index){

const quiz =
quizzes[index];


const container =
document.getElementById(
"quizContainer"
);


container.innerHTML = `

<div class="quiz">

<strong>
${quiz.question}
</strong>

${quiz.answers
.map(
(answer,i)=>`

<button
class="quiz-option"
onclick="answerQuiz(${index},${i},this)"
>

${answer}

</button>

`
)
.join("")}

</div>

`;

}


function answerQuiz(
quizIndex,
answerIndex,
button
){

const quiz =
quizzes[quizIndex];


const buttons =
document.querySelectorAll(
".quiz-option"
);


buttons.forEach(
b=>b.disabled=true
);


if(answerIndex === quiz.correct){

button.classList.add(
"correct"
);


if(
!state.completedLessons.includes(
quizIndex
)
){

state.completedLessons.push(
quizIndex
);

state.xp += 25;

saveState();

updateUI();

}


setTimeout(()=>{

alert(
"Richtig! 🎉\n\n+25 XP"
);

},100);


}else{

button.classList.add(
"wrong"
);


setTimeout(()=>{

alert(
"Nicht ganz. Lies die Lektion noch einmal."
);

},100);

}

}


function updateMissions(){

const tradeDone =
state.trades.length > 0;


document.getElementById(
"missionTradeText"
).innerText =
tradeDone
?"1 / 1 ✓"
:"0 / 1";


document.getElementById(
"missionXPText"
).innerText =
Math.min(state.xp,100)
+" / 100 XP";


document.getElementById(
"missionAcademyText"
).innerText =
state.completedLessons.length>0
?"Abgeschlossen ✓"
:"Nicht abgeschlossen";

}