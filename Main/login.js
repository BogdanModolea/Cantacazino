import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";


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


function writeUserData(userID, email, credits){
  const reference = ref(db, 'users/' + userID);

  set(reference, {
    email: email,
    credits: credits,
  });
}

if(document.getElementById("login-btn")){
  document.getElementById("login-btn").addEventListener('click', function(){
    const loginEmail = document.getElementById("login-email").value;
    const loginPass = document.getElementById("login-pass").value;

    signInWithEmailAndPassword(auth, loginEmail, loginPass)
    .then((userCredential) =>{
      const user = userCredential.user;
    })
    .catch((error)=>{
      const errorCode = error.code;
      const errorMsg = error.message;
      alert(errorMsg);
    });
  });
}


if(document.getElementById("register-btn")){
  document.getElementById("register-btn").addEventListener('click', function(){
    const registerName = document.getElementById("register-name").value;
    const registerEmail = document.getElementById("register-email").value;
    const registerPass = document.getElementById("register-pass").value;

    createUserWithEmailAndPassword(auth, registerEmail, registerPass)
    .then((userCredential) =>{
      const user = userCredential.user;

      const myUserID = user.uid;
      writeUserData(myUserID, registerEmail, 1000);

    })
    .catch((error)=>{
      const errorCode = error.code;
      const errorMsg = error.message;
      alert(errorMsg);
    });
  });
}


auth.onAuthStateChanged(user => {
  if(user){
    const ID = user.uid;
    const userRef = ref(db, 'users/' + ID);
    onValue(userRef, (snapchot) => {
      const currentUser = snapchot.val();
      if(currentUser == null)
        writeUserData(ID, user.email, 1000);
    });


    if(window.location.pathname == "/Main/login.html")
      window.location.replace("/Main/main.html");

    setupUI(user);
  }
  else{
    console.log("logout");

    if(window.location.pathname != "/Main/login.html")
      window.location.replace("/Main/login.html");
  }
});



if(document.getElementById("logout-btn")){
  document.getElementById("logout-btn").addEventListener('click', function(e){
    auth.signOut();
  });
}


function setupUI(user){
  const ID = user.uid;

  if(document.getElementById("credits")){
    const creditsRef = ref(db, 'users/' + ID + '/credits');
    onValue(creditsRef, (snapchot) => {
      const credits = snapchot.val();
      document.getElementById("credits").innerHTML = credits + " Cryptonut"; 
    });
  }
}


if(document.getElementById("credits")){
  document.getElementById("credits").addEventListener('click', function(){

    const ID = auth.currentUser.uid;
    console.log(ID);

    const creditsRef = ref(db, 'users/' + ID);
    onValue(creditsRef, (snapchot) => {
    const credits = snapchot.val().credits;

      const postData = {
        email: snapchot.val().email,
        credits: Math.max(1000, snapchot.val().credits)
      };

      const updates = {};
      updates['/users/' + ID] = postData;

      return update(ref(db), updates);

    });
  });
}