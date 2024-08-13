import { Text, View, TouchableOpacity, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
export default function choosePhoto() {
  const router = useRouter();
  const [profileName, setProfileName] = useState("");
  const [image, setImage] = useState<any>(null);
  const [imageUri, setImageUri] = useState<any>(null);
  let uid = "";
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
    } else {
      console.log("User Signed Out");
    }
  });

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);
  async function putMedia(image: Blob) {
    let { url } = await fetch("http://192.168.50.70:8084/s3Url").then((res) =>
      res.json()
    );

    const params = {
      method: "PUT",
      headers: {
        "Content-Type": image.type,
      },
      body: image,
    };

    const result = await fetch(url, params)
      .then((res) => console.log(res))
      .then((res) => setImageUri(url.split("?")[0]))
      .catch((err) => console.log(err));
    console.log("View img here: ", url.split("?")[0]);
    const uri: string = url.split("?")[0];
    return uri;
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (result.canceled) {
      console.log("error");
    }
    if (!result.canceled) {
      const resp = await fetch(result.assets[0].uri);
      const blob = await resp.blob();
      const uri = await putMedia(blob);
      await imgUriToDB(uri, uid);
      router.replace("./congratulations");
    }
  };

  async function imgUriToDB(uri: string, uid: string) {
    try {
      const result = await fetch("http://192.168.50.70:8084/profileImg", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Uid: uid,
          Uri: uri,
        }),
      });
      if (result.ok) {
        console.log(201);
      }
    } catch (error) {
      console.log("DB upload error: ", error);
    }
  }
  return (
    <LinearGradient
      colors={["#833ab4", "#8589d6", "#fcb045"]}
      start={{ x: 0.1, y: 0.2 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <SafeAreaView>
        <Text className="text-center mt-3 text-2xl font-normal text-white">
          Choose a profile picture!
        </Text>
        <Button
          title={"Next"}
          onPress={() => {
            router.navigate("./choosePhoto");
          }}
        />
        <Button
          title={"skip"}
          onPress={() => {
            router.navigate("./setBio");
          }}
        />
        <Button
          title={"Upload Profile Picture"}
          onPress={async () => {
            pickImage();
            console.log("test");
            router.navigate("./setBio");
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
