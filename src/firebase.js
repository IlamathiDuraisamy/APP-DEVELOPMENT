// firebasec.js
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC1eittte6eM1wwhcAye_PuNrJHGDjkG8I",
    authDomain: "classroom-e617f.firebaseapp.com",
    projectId: "classroom-e617f",
    storageBucket: "classroom-e617f.appspot.com",
    messagingSenderId: "348452540055",
    appId: "1:348452540055:web:2f91b8da5fe2d90732a3d2",
    measurementId: "G-SQRN840J6V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth, ref, push };
