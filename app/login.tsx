import React, { useState, useEffect } from "react";
import { Link, router, useRouter } from "expo-router";
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
// import {
//   saveLoginState,
//   getLoginState,
//   removeLoginState,
// } from "@/components/utils/asyncStorage";
// import { useGoogleSignIn } from "@/components/utils/googleSignIn";
export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const { promptAsync, handleGoogleSignIn } = useGoogleSignIn();
  const router = useRouter();
  // useEffect(() => {
  //   const handleSignIn = async () => {
  //     const userCredential = await handleGoogleSignIn();
  //     if (userCredential) {
  //       router.replace("/home"); // Navigate to home screen after successful login
  //     }
  //   };

  //   handleSignIn();
  // }, [handleGoogleSignIn, router]);

  // useEffect(() => {
  //   const checkLoginState = async () => {
  //     const userToken = await getLoginState();
  //     if (userToken) {
  //       setIsLoggedIn(true);
  //       router.push("/home"); // Navigate to home if logged in
  //     }
  //   };

  //   checkLoginState();
  // }, []);

  //Handles login logic
  const handlePressSignin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(auth.currentUser?.uid);
        router.replace("./(tabs)/home");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        if (!email || !password) {
          Alert.alert(
            "Missing Field",
            "Must enter a valid email and password to continue"
          );
        } else {
          Alert.alert(
            "Invalid Email or Password",
            "Check your spelling for your email and password"
          );
        }
      });
  };
  return (
    <>
      <LinearGradient
        colors={["#833ab4", "#8589d6", "#fcb045"]}
        start={{ x: 0.1, y: 0.2 }}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <StatusBar style="auto" />
        <Text className="text-center mt-3 text-7xl font-bold  text-white">
          Licks
        </Text>
        <Text className="text-center mt-3 text-2xl font-normal text-white">
          Login
        </Text>
        <View className="mt-5 mx-5">
          <View>
            <Text className="text-white">Email:</Text>
            <TextInput
              style={{ width: 200 }}
              value={email}
              onChangeText={(newtext) => setEmail(newtext)}
              placeholder="Enter Email..."
              className="border border-solid p-2 text-black border-white mt-1"
            />
          </View>
          <View className="mt-3">
            <Text className="text-white">Password:</Text>
            <TextInput
              value={password}
              style={{ width: 200 }}
              onChangeText={(newtext) => setPassword(newtext)}
              secureTextEntry
              placeholder="Enter Password..."
              className="border text-black border-solid p-2 border-white mt-1"
            />
          </View>

          <Pressable
            onPress={handlePressSignin}
            className="bg-[#833ab4] mt-4 p-2 rounded-lg"
          >
            <Text className="text-center text-base text-white">Login</Text>
          </Pressable>
          <Button
            title={"Sitemap"}
            onPress={() => router.navigate("/_sitemap")}
          />
        </View>
        {/* </View> */}
      </LinearGradient>
    </>
  );
}
