import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function setBio() {
  let uid = "";
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
    } else {
      console.log("User Signed Out");
    }
  });
  const [bioText, setBioText] = useState<string>("");
  const updateDB = async () => {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Uid: uid,
        BioText: bioText,
      }),
    };
    try {
      const result = await fetch("http://192.168.50.70:8084/updateBio", params);
      if (result.ok) {
        console.log(201);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <LinearGradient
      colors={["#833ab4", "#8589d6", "#fcb045"]}
      start={{ x: 0.1, y: 0.2 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <SafeAreaView>
        <Text className="text-center mt-3 text-2xl font-normal text-white">
          What would you like your bio to say?
        </Text>
        <TextInput
          style={{ width: 200 }}
          value={bioText}
          multiline
          textAlign="left"
          numberOfLines={8}
          maxLength={150}
          onChangeText={(newtext) => setBioText(newtext)}
          placeholder="Enter bio text here..."
          className="border text-black border-solid p-2 border-white mt-1"
        />

        <TouchableOpacity
          onPress={() => {
            updateDB();
            router.replace("./congratulations");
          }}
          className="bg-[#833ab4] mt-4 p-2 rounded-lg"
        >
          <Text className="text-center text-base text-white">Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("./congratulations")}
          className="bg-[#833ab4] mt-4 p-2 rounded-lg"
        >
          <Text className="text-center text-base text-white">Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}
