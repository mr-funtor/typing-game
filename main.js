const wordDisplay = document.getElementById("word-display");
const mainApp = document.getElementById("main-app");
const startBtn = document.getElementById("start-btn");
const timeBar = document.getElementById("time-bar");
const scoreDisplay = document.getElementById("score-display");
const levelPicker = document.getElementById("level-picker");
const resetBtn = document.getElementById("reset-btn");


startBtn.addEventListener("click", startGame);
levelPicker.addEventListener("change", chooseLevel);
resetBtn.addEventListener("click", restartGame)

const allWords = ["Google", "Lion"];
let presentWord = allWords[0];
let letterTracker = 0;

let wordTracker=0;

let levelTimer = 30;

let timerId;

let correctCount=0;

function displayPresentWord(){
  wordDisplay.innerHTML = "";

  for(let i=0; i < presentWord.length; i++){
    const template = `<span>${presentWord[i]}</span>`;
    wordDisplay.innerHTML += template;
  }
}

function compareLetterTyped(e){
  const theElement = wordDisplay.children.item(letterTracker);
  if(e.key === presentWord.charAt(letterTracker)){
    theElement.style.color = "#46eb34";

    correctCount++;
  }else{
    theElement.style.color = "red";
  }

  letterTracker++
}

function initiateTypingMove(e){
  if(e.key === 'Shift') return;

  if(e.key === 'Enter'){
    moveToNextWord();
  }else{
    compareLetterTyped(e);
  }

  
}

function moveToNextWord(){
  if(wordTracker === allWords.length-1){
    terminateGame();
    return;
  }

  // resets to the first letter to be types
  letterTracker = 0;

  wordTracker++;
  presentWord = allWords[wordTracker];

  displayPresentWord();
}

function terminateGame(){
  calculateScore();

  mainApp.classList.add("game-over");
  window.removeEventListener("keydown", initiateTypingMove);

  clearTimeout(timerId);
  timeBar.style.animationPlayState = "paused";

}

function startGame(){
  window.addEventListener("keydown", initiateTypingMove);
  document.documentElement.style.setProperty("--time", `${levelTimer}s`);
  mainApp.classList.add("begin");//this removes the start button and styles the word displayed

  displayPresentWord();

  timerId = setTimeout(()=>terminateGame(),1000*levelTimer);
}

function calculateScore(){
  const allLetters = allWords.reduce((curr, total)=> curr += total, "");
  const theScore = (correctCount/allLetters.length) * 100;
  const flooredScore = Math.floor(theScore);

  scoreDisplay.innerText = `${flooredScore}%`
}

function chooseLevel(e){
  levelTimer = Number(e.currentTarget.value);
}

function restartGame(){
  presentWord = allWords[0];
  letterTracker=0;
  wordTracker=0;
  correctCount = 0;
  timerId = null;

  wordDisplay.innerText = "Press start to begin";
  mainApp.classList.remove("begin");
  mainApp.classList.remove("game-over");
  timeBar.style.animationPlayState = "running";
}