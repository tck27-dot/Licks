import { View, Text, Button } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
export default function uploadSheetMusic() {
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

  useEffect(() => {
    // Update the state with the postID value
    if (params.postID) {
      setPostID(params.postID);
    }
  }, [params]);
  console.log("From sheetmusic: ", postID);
  const [file_uri, setfile_uri] = useState("");
  const pickDoc = async () => {
    let result = await DocumentPicker.getDocumentAsync();
    console.log(result);
    if (result.canceled) {
      console.log("error");
    }
    if (!result.canceled) {
      const resp = await fetch(result.assets[0].uri);
      const blob = await resp.blob();
      const uri = await putMedia(blob);
      postID && (await sheetMusicUriToDB(uri, postID));
      postID && router.setParams({ postID: postID });
      console.log("From sheetmusic: *******************");
      router.push(`./chooseCaption?postID=${postID}`);
    }
  };

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
      .then((res) => setfile_uri(url.split("?")[0]))
      .catch((err) => console.log(err));
    console.log("View img here: ", url.split("?")[0]);
    const uri: string = url.split("?")[0];
    return uri;
  }

  async function sheetMusicUriToDB(uri: string, postID: string) {
    try {
      const result = await fetch(
        "http://192.168.50.70:8084/update_sheet_music",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            PostID: postID,
            Uri: uri,
          }),
        }
      )
        .then((result) => {
          if (result.ok) {
            console.log(201);
            return result.json();
          }
        })
        .then((res) => {
          console.log(res);
          // router.setParams({ postID: res[0].insertId });
        });
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
          Would you like to add sheetmusic or tabs?
        </Text>
        <Button title={"Upload SheetMusic"} onPress={pickDoc} />
        <Button
          title={"Sitemap"}
          onPress={() => router.navigate("/_sitemap")}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
