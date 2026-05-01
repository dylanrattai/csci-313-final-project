import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDMEsYBzsHoqWM5oKwA3BtP6sX8EptXYxw',
  authDomain: 'finalproject-67e93.firebaseapp.com',
  projectId: 'finalproject-67e93',
  storageBucket: 'finalproject-67e93.firebasestorage.app',
  messagingSenderId: '229501916554',
  appId: '1:229501916554:web:6b8b57fc251683954c6473',
};

const firebase_app = initializeApp(firebaseConfig);
export const db = getFirestore(firebase_app);
export const auth = getAuth(firebase_app);