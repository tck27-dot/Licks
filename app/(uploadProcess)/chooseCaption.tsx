import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Button,
  TextInput,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useGlobalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";

export default function chooseCaption() {
  let uid = "";
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
    } else {
      console.log("User Signed Out");
    }
  });
  const [postID, setPostID] = useState<string | null>(null);
  const params = useGlobalSearchParams<{ postID: string }>();
  const [caption_text, setCaption_text] = useState<string | null>(null);

  useEffect(() => {
    // Update the state with the postID value
    if (params.postID) {
      setPostID(params.postID);
    }
  }, [params]);
  console.log("From choose caption: ", postID);

  async function handleUpload() {
    postID && caption_text && Upload(postID, caption_text);
  }

  async function Upload(postID: string, caption_text: string) {
    const params = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_ID: postID,
        caption_text: caption_text,
      }),
    };
    try {
      const result = await fetch(
        "http://192.168.50.70:8084/update_caption",
        params
      );
      if (result.ok) {
        console.log(result.json());
        router.navigate("./allSet");
      }
    } catch (error) {
      console.log(error);
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
          Set your caption!
        </Text>
        <TextInput
          value={caption_text ? caption_text : ""}
          multiline
          textAlign="left"
          numberOfLines={8}
          maxLength={150}
          onChangeText={(newtext) => setCaption_text(newtext)}
          placeholder="Enter caption..."
          className="border text-black border-solid p-2 border-white mt-1"
        />
        <Button
          title={"Submit caption and Submit post"}
          onPress={handleUpload}
        />
        <Button
          title={"Sitemap"}
          onPress={() => router.navigate("/_sitemap")}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
