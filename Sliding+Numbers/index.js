import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";


const firebaseConfig = {
  apiKey: "AIzaSyA_Q3DIPuvojnZ1EG5uWnUBGujqSP32ZxQ",
  authDomain: "cantacazinodb.firebaseapp.com",
  projectId: "cantacazinodb",
  storageBucket: "cantacazinodb.appspot.com",
  messagingSenderId: "499690832844",
  appId: "1:499690832844:web:e610229815c1ac0114d369",
  databaseURL: "https://cantacazinodb-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase();

var balance = 0;
var ID;


auth.onAuthStateChanged(user => {
    if(user){
        console.log(user.uid);
        ID = user.uid;

        const creditsRef = ref(db, 'users/' + ID + '/credits');
        onValue(creditsRef, (snapchot) => {
            const credits = snapchot.val();
            balance = credits;
        });
    }
});

var Mybet = document.getElementById("bet");
var Myvalue = Mybet.value;
var max = balance;
var plus10 = bet.value + 10;
var historys = [0,1,2,3,4,5,6,7,8,9,10];
var redBox = document.getElementById("red-box");
var greenBox = document.getElementById("green-box");
var blackBox = document.getElementById("black-box");
var red = 0;
var green = 0;
var black = 0;
var spinTime = 5;
var rolling = false;
var timerDiv = document.getElementById("timer");
var balDiv = document.getElementById("credits");
balDiv.innerHTML = balance + " Cryptonut";
var out = document.getElementById("out");
var timer = 0;

function roll(c){
  if(rolling == false){
    rolling = true;
    var scroll = document.getElementById("scroll");
    
    var x = Math.floor(Math.random() * (28 + 1));
    out.innerHTML = "IT'S " + x;
    historys.splice(0, 0, x);
    
    scroll.style.transition = "margin "+spinTime+"s ease";
    scroll.style.marginLeft = "calc(250px - 25px - (1450px * 6) - (50px * "+x+"))";
    
    setTimeout(function(){
      scroll.style.transition = "margin 0s ease";
      scroll.style.marginLeft = "calc(250px - 25px - (1450px * 1) - (50px * "+x+"))";
      rolling = false;
    }, spinTime*1000);
    timerDiv.style.width = "100%";
    timerDiv.style.opacity = "0";
    setTimeout(function(){timerDiv.style.width = "0%";},1000);
    setTimeout(function(){
      var profit = 0;
      var infoDiv = document.getElementById("info");
      if(historyColours(x) == "red"){
        balance += red * 2;
        profit += parseInt(red);
      }
      if(historyColours(x) == "black"){
        balance += black * 2;
        profit += parseInt(black);
      }
      if(historyColours(x) == "green"){
        balance += green * 14;
        profit += parseInt(green);
      }
      infoDiv.innerHTML = "+"+profit;
      console.log("+"+profit);
      balDiv.innerHTML = balance + " Cryptonut";

      const creditsRef = ref(db, 'users/' + ID);
      onValue(creditsRef, (snapchot) => {
        const credits = snapchot.val().credits;
        const postData = {
            email: snapchot.val().email,
            credits: balance
        };
        const updates = {};
        updates['/users/' + ID] = postData;

        return update(ref(db), updates);
      });

      updateBet("clear");
    },4000);
    setTimeout(function(){out.style.opacity = "1"; out.style.animation = "out .5s ease-out forwards";},5000);
    setTimeout(function(){out.style.opacity = "0";},7000);
    setTimeout(function(){out.style.animation = ""; printHistory();},7400);
  }
}

function loops(){
  timerDiv.style.width = "0%";
  timerDiv.style.opacity = "1";
  setTimeout(function(){timerDiv.style.width = "100%"},1);
  setTimeout(roll,5000);
}

function printHistory(){
  if(historys.length == 12){
    historys.pop();
  }
  document.getElementById("h").innerHTML = "";
  for(let i=0;i<historys.length;i++){
    document.getElementById("h").innerHTML += "<div class='history-box "+historyColours(historys[i])+"'>"+historys[i]+"</div>";
  }
}

function historyColours(c){
  c = parseInt(c);
  if(c == 0){
    return "green";
  }
  if(c % 2 == 0){
    return "black";
  } else {
    return "red";
  }
}
function Bettinginputupdate(button){
    if(button == "max"){
      Mybet.value = balance;
      return; 
    }
  if(button == "add10"){
    document.getElementById("bet").valueAsNumber +=10; 
  }
  if(button == "add100"){
    document.getElementById("bet").valueAsNumber +=100; 
  }
  if(button == "add1000"){
    document.getElementById("bet").valueAsNumber +=1000; 
  }
}
function updateBet(button){
  if(rolling == false){
    var bet = document.getElementById("bet").value;
    if(button == "red"){
      red += parseInt(bet);
    }
    if(button == "black"){
      black += parseInt(bet);
    }
    if(button == "green"){
      green += parseInt(bet);
    }
     if(bet > balance){
          alert("Insufficiant Funds");
       stop;
       return; 
    }
    redBox.innerHTML = red;
    greenBox.innerHTML = green;
    blackBox.innerHTML = black;
    balance = balance - bet;
    balDiv.innerHTML = balance + " Cryptonut";

    const creditsRef = ref(db, 'users/' + ID);
    onValue(creditsRef, (snapchot) => {
        const credits = snapchot.val().credits;
        const postData = {
            email: snapchot.val().email,
            credits: balance
        };
        const updates = {};
        updates['/users/' + ID] = postData;

        return update(ref(db), updates);
    });


  } else {
    if(button == "clear"){
      console.log("clear");
      red = 0;
      black = 0;
      green = 0;
      bet = 0;
    }
    redBox.innerHTML = red;
    greenBox.innerHTML = green;
    blackBox.innerHTML = black;
  }
}

function clearBet (){
  redBox.innerHTML = "";
  greenBox.innerHTML = "";
  blackBox.innerHTML = "";
}

document.getElementById("max").addEventListener("click", function(){ 
  Bettinginputupdate("max");
});

document.getElementById("add10").addEventListener("click", function(){ 
  Bettinginputupdate("add10");
});

document.getElementById("add100").addEventListener("click", function(){ 
  Bettinginputupdate("add100");
});

document.getElementById("add1000").addEventListener("click", function(){ 
  Bettinginputupdate("add1000");
});

document.getElementById("red").addEventListener("click", function(){ 
  updateBet("red");
});

document.getElementById("green").addEventListener("click", function(){
  updateBet("green");
});

document.getElementById("black").addEventListener("click", function(){
  updateBet("black");
});

balDiv.innerHTML = balance + " Cryptonut";
printHistory();
loops();
setInterval(loops, 20000);