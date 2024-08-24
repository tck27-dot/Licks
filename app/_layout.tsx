import { Stack } from "expo-router/stack";
import { initializeApp } from "firebase/app";
import { PostProvider } from "@/components/utils/PostContext";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
} from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";
// import firebase from "firebase/app";
// import { initializeAuth } from "firebase/auth";
// import * as firebaseAuth from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getApps, getApp } from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyALwYesSaPkDhl-hkNnNnEnruEmUxIuIw8",
  authDomain: "licks-5edf4.firebaseapp.com",
  projectId: "licks-5edf4",
  storageBucket: "licks-5edf4.appspot.com",
  messagingSenderId: "799013023999",
  appId: "1:799013023999:web:3fc2aba0b18f1754b3dcca",
  measurementId: "G-DJTF1T42XG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

//Creates collection and document
//daily special is the collection name
//2021-09-14 is the document name
// export const specialOftheDay = doc(db, "dailySpecial/2021-09-14");

// //write to document
// function writeDailySpecial() {
//   const docData = {
//     description: "Vanilla",
//     price: 3.99,
//     milk: "Whole",
//     vegan: false,
//   };
//   setDoc(specialOftheDay, docData);
// }

// writeDailySpecial();

// const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// // initialize auth
// const auth = initializeAuth(app, {
//   persistence: reactNativePersistence(AsyncStorage),
// });

export default function Layout() {
  return (
    <PostProvider>
      <Stack initialRouteName="index">
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(signupProcess)" options={{ headerShown: false }} />
        <Stack.Screen
          name="(uploadProcess)"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack>
    </PostProvider>
  );
}
