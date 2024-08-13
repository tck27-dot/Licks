import { Text, View, TouchableOpacity, TextInput, Button } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import React from "react";
import { SafeAreaView } from "react-native";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { LinearGradient } from "expo-linear-gradient";
export default function chooseName() {
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  let uid = "";
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
    } else {
      console.log("User Signed Out");
    }
  });
  const addNametoDB = async (
    FirstName: string,
    LastName: string,
    Uid: string
  ) => {
    try {
      const result = await fetch("http://192.168.50.70:8084/addFullName", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FirstName: FirstName,
          LastName: LastName,
          Uid: Uid,
        }),
      });

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
          Whats your name?
        </Text>
        <Text>{uid}</Text>
        <TextInput
          value={FirstName}
          onChangeText={(newtext) => setFirstName(newtext)}
          placeholder="Enter First Name..."
          className="border text-black border-solid p-2 border-white mt-1"
        />
        <TextInput
          value={LastName}
          onChangeText={(newtext) => setLastName(newtext)}
          placeholder="Enter Last Name..."
          className="border text-black border-dotted p-2 border-white mt-1"
        />
        <Button
          title={"Next"}
          onPress={async () => {
            await addNametoDB(FirstName, LastName, uid).then(() =>
              router.navigate("./chooseName")
            );
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
