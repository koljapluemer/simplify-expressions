import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBZkv2DoGbp1kk0sxdg9T3o9Z22b0cIPg0',
  authDomain: 'tpr-game.firebaseapp.com',
  projectId: 'tpr-game',
  storageBucket: 'tpr-game.firebasestorage.app',
  messagingSenderId: '213328104326',
  appId: '1:213328104326:web:bf6defc7e291d5fe267a07'
}

const firebaseApp = initializeApp(firebaseConfig)

export const firestore = getFirestore(firebaseApp)
