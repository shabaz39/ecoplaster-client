import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD8q8s8-UVawuIW30eyUX_u-uNZjtocDCs",
    authDomain: "ecoplaster-dec7e.firebaseapp.com",
    projectId: "ecoplaster-dec7e",
    storageBucket: "ecoplaster-dec7e.firebasestorage.app",
    messagingSenderId: "918265864366",
    appId: "1:918265864366:web:f22f5c51b8d6dcce934d3f",
    measurementId: "G-NYC0508LB8"
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
