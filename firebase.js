// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword } from 'firebase/auth';//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC8QbNnlZ1za62BnAs_0dvUcHLW1fpxQA",
  authDomain: "incercare-30889.firebaseapp.com",
  projectId: "incercare-30889",
  storageBucket: "incercare-30889.appspot.com",
  messagingSenderId: "69696067266",
  appId: "1:69696067266:web:f03ec625471160b25acd5b",
  measurementId: "G-S72GQ6SCLQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);