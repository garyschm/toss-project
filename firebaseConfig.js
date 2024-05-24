import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBzBKYBTVOSxTuribs6rlQgBynuTA0UZiw",
    authDomain: "toss-799fe.firebaseapp.com",
    projectId: "toss-799fe",
    storageBucket: "toss-799fe.appspot.com",
    messagingSenderId: "944692851950",
    appId: "1:944692851950:web:8d06bc3767e11bb4286fff",
    measurementId: "G-T4910X6BL6"
  };



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { firebaseConfig, auth, db };
