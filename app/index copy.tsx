import React, { useState } from "react";
import { Link, router } from "expo-router";
import { Text, View, TouchableOpacity, TextInput, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import { app } from "./_layout";
import * as ImagePicker from "expo-image-picker";
import { Image } from "react-native";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

export default function index() {
  let currUserId = "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setSuccess] = useState(false);
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      Name: getAuth().currentUser?.displayName,
      Uid: getAuth().currentUser?.uid,
    }),
  };
  const updateDB = async (id: string, name: string) => {
    try {
      const result = await fetch("http://192.168.50.70:8082/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,
          Uid: id,
        }),
      });
      if (result.ok) {
        console.log("201");
      }
    } catch (error) {
      console.log("Database error: ", error);
    }
  };

  const handlePressSignup = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userid = userCredential.user.uid;
        currUserId = userid;
        const userName: any = userCredential.user.displayName;
        updateDB(userid, userName);
        router.replace("./(signupProcess)/setNames");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage + errorCode);
      });
  };

  const [image, setImage] = useState<string>("");
  const [imageUri, setImageUri] = useState<any>(null);
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

  return (
    <>
      {/* <View className="flex-1 justify-center items-center bg-gradient-to-r from-indigo-500"> */}
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
          Sign Up
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

          <TouchableOpacity
            onPress={handlePressSignup}
            className="bg-[#833ab4] mt-4 p-2 rounded-lg"
          >
            <Text className="text-center text-base text-white">
              Create Account
            </Text>
          </TouchableOpacity>

          <Text className="text-white mt-3 text-center">Or login</Text>

          <TouchableOpacity className="bg-[#833ab4] mt-4 p-2 rounded-lg">
            <Link replace href="./login">
              <Text className="text-center text-base text-white">Login</Text>
            </Link>
          </TouchableOpacity>
        </View>

        <View>
          <Image
            source={{
              uri: "https://licks-bucket-2.s3.us-east-1.amazonaws.com/1926d99234d1b33d9f48d897b5df10fe",
            }}
            className="w-auto h-auto"
          />
        </View>
      </LinearGradient>
      {/* </View> */}
    </>
  );
}
