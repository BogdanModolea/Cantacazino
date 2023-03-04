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

var balance;
var ID;


auth.onAuthStateChanged(user => {
    if(user){
        console.log(user.uid);
        ID = user.uid;

        const creditsRef = ref(db, 'users/' + ID + '/credits');
        onValue(creditsRef, (snapchot) => {
            const credits = snapchot.val();
            balance = credits;
            document.getElementById("credits").innerHTML = balance + " Cryptonut";  
        });
    }
});
  

var doing = false;
var spin = [new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3"),new Audio("res/sounds/spin.mp3")];
var coin = [new Audio("res/sounds/coin.mp3"),new Audio("res/sounds/coin.mp3"),new Audio("res/sounds/coin.mp3")]
var win = new Audio("res/sounds/win.mp3");
var lose = new Audio("res/sounds/lose.mp3");
var audio = false;
let status = document.getElementById("status")
var info = true;


function displayRadioValue() {
    var ele = document.getElementsByName('bet');
          
    for(let i = 0; i < ele.length; i++) {
        if(ele[i].checked)
			return ele[i].value;
    }

	return null;
}

document.getElementById("Gira").addEventListener('click', doSlot);

function doSlot(){
	const now = displayRadioValue();
	if(now){
		var bet = now;
		balance = balance - bet;
		document.getElementById("credits").innerHTML = balance + " Cryptonut"; 
		console.log(bet);

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

		if (doing){return null;}
		doing = true;
		var numChanges = randomInt(1,4)*7
		var numeberSlot1 = numChanges+randomInt(1,7)
		var numeberSlot2 = numChanges+2*7+randomInt(1,7)
		var numeberSlot3 = numChanges+4*7+randomInt(1,7)

		var i1 = 0;
		var i2 = 0;
		var i3 = 0;
		var sound = 0
		status.innerHTML = "SPINNING"
		function spin1(){
			i1++;
			if (i1>=numeberSlot1){
				coin[0].play()
				clearInterval(slot1);
				return null;
			}
			var slotTile = document.getElementById("slot1");
			if (slotTile.className=="a7"){
				slotTile.className = "a0";
			}
			slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
		}
		function spin2(){
			i2++;
			if (i2>=numeberSlot2){
				coin[1].play()
				clearInterval(slot2);
				return null;
			}
			var slotTile = document.getElementById("slot2");
			if (slotTile.className=="a7"){
				slotTile.className = "a0";
			}
			slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
		}
		function spin3(){
			i3++;
			if (i3>=numeberSlot3){
				coin[2].play()
				clearInterval(slot3);
				testWin(bet);
				return null;
			}
			var slotTile = document.getElementById("slot3");
			if (slotTile.className=="a7"){
				slotTile.className = "a0";
			}
			sound++;
			if (sound==spin.length){
				sound=0;
			}
			spin[sound].play();
			slotTile.className = "a"+(parseInt(slotTile.className.substring(1))+1)
		}

        var slot1 = setInterval(spin1, 50);
		var slot2 = setInterval(spin2, 50);
		var slot3 = setInterval(spin3, 50);
	}
}

function testWin(bet){
	var slot1 = document.getElementById("slot1").className
	var slot2 = document.getElementById("slot2").className
	var slot3 = document.getElementById("slot3").className

	if (((slot1 == slot2 && slot2 == slot3) ||
		(slot1 == slot2 && slot3 == "a7") ||
		(slot1 == slot3 && slot2 == "a7") ||
		(slot2 == slot3 && slot1 == "a7") ||
		(slot1 == slot2 && slot1 == "a7") ||
		(slot1 == slot3 && slot1 == "a7") ||
		(slot2 == slot3 && slot2 == "a7") ) && !(slot1 == slot2 && slot2 == slot3 && slot1=="a7")){
		status.innerHTML = "YOU WIN!" + bet * 3;
		balance = balance + bet * 3;
		document.getElementById("credits").innerHTML = balance + " Cryptonut"; 


		win.play();
	}else{
		status.innerHTML = "YOU LOSE!"
		lose.play();
	}

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

	doing = false;

}

function toggleAudio(){
	if (!audio){
		audio = !audio;
		for (var x of spin){
			x.volume = 0.5;
		}
		for (var x of coin){
			x.volume = 0.5;
		}
		win.volume = 1.0;
		lose.volume = 1.0;
	}else{
		audio = !audio;
		for (var x of spin){
			x.volume = 0;
		}
		for (var x of coin){
			x.volume = 0;
		}
		win.volume = 0;
		lose.volume = 0;
	}
	document.getElementById("audio").src = "res/icons/audio"+(audio?"On":"Off")+".png";
}

document.getElementById("options").addEventListener('click', toggleAudio);

function randomInt(min, max){
	return Math.floor((Math.random() * (max-min+1)) + min);
}