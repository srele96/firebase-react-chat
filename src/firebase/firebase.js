// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const auth = firebase.auth;
const firestore = firebase.firestore;
const initializeApp = firebase.initializeApp;

var firebaseConfig = {
  apiKey: "AIzaSyDovNRoGKyqr2ayyOR--8zi7Df2CxdQXWk",
  authDomain: "fir-react-chat-ace42.firebaseapp.com",
  projectId: "fir-react-chat-ace42",
  storageBucket: "fir-react-chat-ace42.appspot.com",
  messagingSenderId: "683063937354",
  appId: "1:683063937354:web:b9cf903b3a9adac57119b3"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// for development use
if(window.location.hostname === 'localhost') {
  firestore().useEmulator("localhost", 8080);
  
  auth().useEmulator("http://localhost:9099");
}

export { auth, firestore };