var startEl = document.querySelector(".start-btn");
var welcomeEl = document.querySelector(".welcome");
var quizEl = document.querySelector(".quiz");
var countdownEl = document.querySelector("#countdown");
var scoreId = 0;
var timeLeft = 75;
var quizNumber = 1;

var record = [];

var quizCollection = ["A very useful tool used during development adn debugging for printing content to the debugger is:||JavaScript||terminal||for loops||console.log||2", "String values must be enclosed within ___ when being assignedto variables.||commas||curly brackets||quotes||parenthesis||1", "Arrays in JavaScript can be used to store||numbers and strings||other arrays||booleans||all the above||3", "Commonly used data types DO Not include:||strings||booleans||alerts||numbers||1", "The condition in an if/else statement is enclsed with____.||quotes||curly brackets||parenthesis||square brackets||1"];

function createJudge() {
  var answerEl = document.createElement("p");
  answerEl.className = "answer";
  judgeEl.textContent = "";
  return answerEl;
}

function createQuizAction() {
  var quizString = quizCollection[quizNumber];
  var newQuizEl = createQuiz(quizString);
  quizEl.appendChild(newQuizEl);

  //   var judgeEl = createJudge();
  //   quizEl.appendChild(judgeEl);

  newQuizEl.addEventListener("click", function (event) {
    if (event.target.matches("li")) {
      //update the score
      var quizChoice = event.target.dataset.number;
      console.log(quizChoice);

      var quizArray = quizString.split("||");
      console.log(parseInt(quizArray[5]));
      //deduct the score by 15 if answer is wrong
      if (quizChoice !== quizArray[5]) {
        // judgeEl.textContent = "Wrong!";
        timeLeft -= 14;

        if (timeLeft <= 0) {
          timeLeft = 0;
          quizEl.innerHTML = "";
          createComplete(0);
          return false;
        }

        //redirect if reach the final question
        if (quizNumber === quizCollection.length) {
          createComplete(timeLeft);
          return false;
        }
      }

      quizEl.innerHTML = "";
      quizNumber++;
      createQuizAction();
    }
  });
}

function countdown() {
  var timer = setInterval(function () {
    countdownEl.textContent = "Time: " + timeLeft;
    if (timeLeft <= 0) {
      window.clearInterval(timer);
      quizEl.innerHTML = "";
      createComplete(timeLeft);
    }
    timeLeft--;
  }, 1000);
}

function createComplete(score) {
  quizEl.innerHTML = "";
  var completeContainerEl = document.createElement("div");
  completeContainerEl.className = "complete-part layout";
  var quizTitleEl = document.createElement("p");
  quizTitleEl.className = "quiz-title";
  quizTitleEl.textContent = "All done!";
  var scoreEl = document.createElement("p");
  scoreEl.className = "player-score";
  scoreEl.textContent = "Your final score is " + score;
  var formEl = document.createElement("form");
  formEl.setAttribute("id", "quiz-form");
  var playerInitialEl = document.createElement("p");
  playerInitialEl.className = "player-initials";
  playerInitialEl.textContent = "Enter initials:";
  var playerInputEL = document.createElement("input");
  playerInputEL.setAttribute("type", "text");
  playerInputEL.setAttribute("id", "player-input");
  var submitEL = document.createElement("button");
  submitEL.setAttribute("id", "save-score");
  submitEL.setAttribute("type", "submit");
  submitEL.textContent = "Submit";
  formEl.appendChild(scoreEl);
  formEl.appendChild(playerInitialEl);
  formEl.appendChild(playerInputEL);
  formEl.appendChild(submitEL);

  completeContainerEl.appendChild(quizTitleEl);

  completeContainerEl.appendChild(formEl);

  //   return completeContainerEl;
  quizEl.appendChild(completeContainerEl);

  formEl.addEventListener("submit", formHandler);
}

function formHandler(event) {
  event.preventDefault();
  var fmEl = event.target;
  var getInitials = fmEl.querySelector("#player-input").value;
  var getScore = fmEl.querySelector(".player-score").textContent.split(" ")[-1];

  // if name is invalid: alert and  reset form
  if (!getInitials) {
    alert("please enter a valid name");
  }
  // if name is valid: load the page and create the new playerObj
  else {
    load();
    // create new player obj
    var playerInfo = {
      name: getInitials,
      score: getScore,
      id: scoreId,
    };
    //create new player El
    createScore(playerInfo);
  }
}

function save() {
  localStorage.setItem("record", JSON.stringify(record));
}

// function to create and save single player obj
function createScore(playerObj) {
  var listItemEl = document.createElement("li");
  var scoreListEl = quizEl.querySelector("ul");
  var orderNumber = playerObj.id + 1;
  listItemEl.textContent = orderNumber + ". " + playerObj.name + " - " + playerObj.score;
  scoreListEl.appendChild(listItemEl);

  scoreId++;
  record.push(playerObj);
  save();
}

//load
function load() {
  //1. load all existing divs and ul
  quizEl.innerHTML = "";
  var scoreContainerEL = document.createElement("div");
  scoreContainerEL.className = "high-score layout";
  var quizTitleEl = document.createElement("p");
  quizTitleEl.className = "quiz-title";
  quizTitleEl.textContent = "High scores";
  var scoreListEl = document.createElement("ul");
  scoreListEl.className = "scoreList";

  var backBtnEl = document.createElement("button");

  backBtnEl.className = "backBtn";
  backBtnEl.textContent = "Go back";
  //backBtn to redirect
  backBtnEl.addEventListener("click", function () {
    window.location.href = "http://127.0.0.1:5500/index.html";
  });

  var clearBtnEl = document.createElement("button");
  clearBtnEl.textContent = "Clear high scores";
  //clearBtn to clear caches
  clearBtnEl.addEventListener("click", function () {
    localStorage.clear();
    record = [];
    load();
  });

  scoreContainerEL.appendChild(quizTitleEl);
  scoreContainerEL.appendChild(scoreListEl);
  scoreContainerEL.appendChild(backBtnEl);
  scoreContainerEL.appendChild(clearBtnEl);
  quizEl.appendChild(scoreContainerEL);

  // 2. load savedrecord
  var savedRecord = localStorage.getItem("record");
  if (savedRecord === null) {
    return false;
  }
  var savedRecord = JSON.parse(savedRecord);

  for (let i = 1; i <= savedRecord.length; i++) {
    createScore(savedRecord[i - 1]);
  }
}

startEl.addEventListener("click", () => {
  countdownEl.textContent = "Time: " + timeLeft;
  countdown(timeLeft);
  welcomeEl.remove();
  createQuizAction();
});

var createQuiz = function (quizString) {
  var quizArray = quizString.split("||");
  var quizContainerEl = document.createElement("div");
  quizContainerEl.className = "quiz-part layout";

  var quizTitleEl = document.createElement("p");
  quizTitleEl.textContent = quizArray[0];
  //   console.log(quizTitleEl);
  quizTitleEl.className = "quiz-title";
  var quizListEl = document.createElement("ul");
  for (let i = 0; i < 4; i++) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "option";
    listItemEl.textContent = i + 1 + ". " + quizArray[i + 1];
    listItemEl.setAttribute("data-number", i);

    quizListEl.appendChild(listItemEl);
    // console.log(listItemEl);
  }
  quizContainerEl.appendChild(quizTitleEl);
  quizContainerEl.appendChild(quizListEl);

  return quizContainerEl;
};
