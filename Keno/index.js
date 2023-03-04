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

var credits;
var ID;


auth.onAuthStateChanged(user => {
    if(user){
        console.log(user.uid);
        ID = user.uid;

        const creditsRef = ref(db, 'users/' + ID + '/credits');
        onValue(creditsRef, (snapchot) => {
            const balance = snapchot.val();
            credits = balance;
            document.getElementById("playerCredits").innerHTML = credits;
        });
    }
});


var numbers = document.getElementById("numbers");
var winningNumbers = document.getElementById("winningNumbers");
var msg = document.getElementById("msg");
var payTable = document.getElementById("pay-table");
var winCredits = document.getElementById("winCredits");
var playerCredits = document.getElementById("playerCredits");
var overlay = document.getElementById("overlay");
var playerNums = [];
var currNums = [];
var maxNum = 10;
var winningNums = [];
var allNums = [];
var winAmt;

var payouts = [
	[0],
	[0,2],
	[0,0,11],
	[0,0,2,27],
	[0,0,1,5,75],
	[0,0,0,2,18,420],
	[0,0,0,1,8,50,1100],
	[0,0,0,1,3,17,100,4500],
	[0,0,0,0,2,12,50,750,10000],
	[0,0,0,0,1,6,25,150,3000,30000],
	[5,0,0,0,0,2,15,40,450,4250,100000]
];

function init() {
	document.getElementById("gameover").style.display = "none";
	createBoard();
	updatePayTable();
	makeNumbersSelectable();
	msg.innerHTML = "Select numbers:";
	playerCredits.innerHTML = credits;
	winCredits.innerHTML = "--";
}

init();

function playGame() {
	
	overlay.style.display = "block"; // no interacting with board/buttons until round is finished
	
	if (credits > 0) {
		credits--;
		
		updateCredits();
		var numberWinning = 0;
        winAmt = 0;
		clearWinningNums();
		var total = 20;
		getPlayerNums();
		
		var myInterval = setInterval(getNextNumber,200);

		function getNextNumber() {
			if (winningNums.length >= 20) {
				clearInterval(myInterval);
				finishTurn(winAmt);
			}
			else {
				var p = document.createElement("SPAN");
				var r = getRandom();
				if (winningNums.includes(r)) {
					// duplicate random number
				}
				else {
					winningNums.push(r);
					var txt = document.createTextNode(r);
					p.appendChild(txt);
					allNums[r-1].classList.add("winning");
					if (playerNums.includes(r)) {
						p.style.backgroundColor = "red";
						p.style.color = "#fefefe";
						allNums[r-1].classList.add("win-selected");
						numberWinning++;
					}
					winningNumbers.appendChild(p);
					// console.log("2 winningNums.length: " + winningNums.length + " " + winningNums);
				}
			}
			winAmt = getWinningCreditAmount(numberWinning);
			highlightPayoutRow(numberWinning);

			if (winAmt == 0) {
				winCredits.style.backgroundColor = "#24282f";
				winCredits.style.color = "#fefefe";
			}
			msg.innerHTML = numberWinning + " hits = " + winAmt;
		}
	}
	else {
		document.getElementById("gameover").style.display = "block";
	}
}

function finishTurn(winAmt) {
	winCredits.innerHTML = winAmt;
	winCredits.style.backgroundColor = "red";
	winCredits.style.color = "#fefefe";
	credits += winAmt;
	updateCredits();
	overlay.style.display = "none";
}

function highlightPayoutRow(numberWinning) {
	var rows = payTable.getElementsByTagName("TR");
	for (var i=0; i<rows.length; i++) {
		rows[i].style.backgroundColor = "#24282f";
		rows[i].style.color = "#fefefe";		
	}
	winAmt = getWinningCreditAmount(numberWinning);
	// console.log("highlightPayoutRow: numberWinning: " + numberWinning + " ** winAmt: " + winAmt);	
	if (winAmt > 0) {
		rows[numberWinning].style.backgroundColor = "#24282f";
		rows[numberWinning].style.color = "#fefefe";
	}
}

function createBoard() {
	var n = 1;
	var t = document.createElement("TABLE");
	for (var i=0; i<8; i++) {
		var tr = document.createElement("TR");
		for (var j=0; j<10; j++) {
			var td = document.createElement("TD");
			var tx = document.createTextNode(n);
			td.appendChild(tx);
			allNums.push(td);
			n++;
			tr.appendChild(td);
		}
		t.appendChild(tr);
	}
	numbers.appendChild(t);
}

function makeNumbersSelectable() {
	var nums = document.getElementsByTagName("TD");
		for (var i=0; i<nums.length; i++) {
		nums[i].addEventListener("click", function() {
			checkNum(this);
		});
	}
}

function updatePayTable() {
	var n = getCurrentNumberOfSelected();
	createPayTable(n);
}

function checkNum(t) {
	clearWinningNums();
	var c = getCurrentNumberOfSelected();	// number before newest
	if (t.classList.contains("selected"))
		t.classList.remove("selected");
	else if (c < maxNum)
		t.classList.add("selected");
	updateMessage();
	updatePayTable();
}

function updateMessage() {
	var n = getCurrentNumberOfSelected();
	msg.innerHTML = "Selected " + n + " numbers";
}

function getCurrentNumberOfSelected() { // based on blue background
	var curr = [];
	var td = document.getElementsByTagName("TD");
	for (var i=0; i<td.length; i++) {
		if (td[i].classList.contains("selected")) {
			curr.push(td[i].innerText);
		}
	}
	return curr.length;
}

function getPlayerNums() {
	playerNums.length = 0;
	var td = document.getElementsByTagName("TD");
	for (var i=0; i<td.length; i++) {
		if (td[i].classList.contains("selected")) {
			var a = td[i].innerText;
			var b = parseInt(a);
			playerNums.push(b);
		}
	}
}

function getRandom() {
	var r = (Math.floor(Math.random()*80)) + 1;
	return r;
}

function updateCredits() {
	
	const creditsRef = ref(db, 'users/' + ID);
      onValue(creditsRef, (snapchot) => {
        const postData = {
            email: snapchot.val().email,
            credits: credits
        };
        const updates = {};
        updates['/users/' + ID] = postData;

        return update(ref(db), updates);
      });

	playerCredits.innerHTML = credits;
}

/*
function clearEverything() {
	winCredits.style.backgroundColor = "white";
	winCredits.style.color = "black";
	clearPlayerNums();
	clearWinningNums();
	createPayTable(0);
}
*/

function clearPlayerNums() {
	clearWinningNums();
	playerNums.length = 0;
	var td = document.getElementsByTagName("TD");
	for (var i=0; i<td.length; i++) {
		td[i].classList.remove("selected");
	}
	updatePayTable();
}

function clearWinningNums() {
	winCredits.innerHTML = 0;
	winCredits.style.backgroundColor = "#24282f";
	winCredits.style.color = "#fefefe";
	
	var rows = payTable.getElementsByTagName("TR");
	for (var i=0; i<rows.length; i++) {
		rows[i].style.backgroundColor = "#24282f";
		rows[i].style.color = "#fefefe";		
	}

	for (var i=0; i<allNums.length; i++) {
		allNums[i].classList.remove("winning");
		allNums[i].classList.remove("win-selected");
	}
	winningNums.length = 0;
	winningNumbers.innerHTML = "";
}

function getWinningCreditAmount(numHits) {
	var numSelected = getCurrentNumberOfSelected();
	var win = payouts[numSelected][numHits];
	// console.log("number of hits: " + numHits + " win amount is " + win);
	return win;
}

function createPayTable(n) {
	if (payTable.hasChildNodes()) {
		payTable.removeChild(payTable.childNodes[0]);
	}
	var table = document.createElement("TABLE");
	table.style.backgroundColor = "#24282f";
	table.style.color = "#fefefe";
	for (var i=0; i<payouts[n].length; i++) {
		var row = document.createElement("TR");
		var td1 = document.createElement("TD");
		var txt1 = document.createTextNode(i);
		td1.appendChild(txt1);
		row.appendChild(td1);
		var td2 = document.createElement("TD");
		var txt2 = document.createTextNode(payouts[n][i]);
		td2.appendChild(txt2);
		row.appendChild(td2);
		
		var amt = parseInt(payouts[n][i]);
		// console.log("amt: " + amt);
		if (amt == 0) {
			row.style.display = "none";
		}
		
		
		table.appendChild(row);
	}
	payTable.appendChild(table);
}


document.getElementById("toPlay").addEventListener('click', playGame);
document.getElementById("toClear").addEventListener('click', clearPlayerNums);