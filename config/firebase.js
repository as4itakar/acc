import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyDKX5BAmmEuOIe96ozV3mxaE7tSTy0oLGs",
    authDomain: "shop-9147c.firebaseapp.com",
    projectId: "shop-9147c",
    storageBucket: "shop-9147c.appspot.com",
    messagingSenderId: "1034981818817",
    appId: "1:1034981818817:web:62a48558258c0207ee2f40"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const database = getFirestore(app)
export const storage = getStorage(app)