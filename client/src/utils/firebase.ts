// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ9X-YB2bH2DincHPiFmbR8P0os297qjk",
  authDomain: "pics-art-d5337.firebaseapp.com",
  projectId: "pics-art-d5337",
  storageBucket: "pics-art-d5337.appspot.com",
  messagingSenderId: "630760444428",
  appId: "1:630760444428:web:0c108204e8ec50db089429",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
