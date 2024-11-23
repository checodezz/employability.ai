import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3VWOGJFu2pOp1xnEmNvLTc6Y4u1PMqsU",
  authDomain: "employability-6a5c7.firebaseapp.com",
  projectId: "employability-6a5c7",
  storageBucket: "employability-6a5c7.appspot.com",
  messagingSenderId: "925683417892",
  appId: "1:925683417892:web:2588bf905de138897829b1",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
