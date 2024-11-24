import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from 'firebase/database';

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3EE9BdaogEfV2pGUaDomsO29jCwM_Vj4",
  authDomain: "sahkaar-setu.firebaseapp.com",
  databaseURL: "https://sahkaar-setu-default-rtdb.asia-southeast1.firebasedatabase.app", // Add your database URL here
  projectId: "sahkaar-setu",
  storageBucket: "sahkaar-setu.appspot.com",
  messagingSenderId: "1005716731264",
  appId: "1:1005716731264:web:bb0d86820c4bca1bc73d65",
  measurementId: "G-NFRLSZPLYS",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const db2 = getDatabase(app);

export { db,db2, collection, doc,auth,storage, setDoc, updateDoc, arrayUnion ,getDocs};
