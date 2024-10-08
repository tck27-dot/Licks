import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function chooseVid() {
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

  // (async function perm() {
  //   await ImagePicker.requestMediaLibraryPermissionsAsync();
  // })();

  useEffect(() => {
    (async () => {
      try {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      } catch (error) {
        console.log(error);
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
    const objKey: string = uri.split("/")[3];
    return [uri, objKey];
  }

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        console.log("error");
      }
      if (!result.canceled) {
        const resp = await fetch(result.assets[0].uri);
        resp.ok && console.log("Step 1 Good!");
        const blob = await resp.blob();
        blob && console.log("Step 2 ok!");
        const [uri, objKey] = await putMedia(blob);
        uri && console.log("Uri ok!");
        result.assets[0].duration &&
          (await vidUriToDB(uri, uid, result.assets[0].duration, objKey));
      }
    } catch (e) {
      console.log("Pick Image error: ", e);
    }
  };

  async function vidUriToDB(
    uri: string,
    uid: string,
    duration: number,
    objKey: string
  ) {
    try {
      const result = await fetch(
        "http://192.168.50.70:8084/update_media_file",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Uid: uid,
            Uri: uri,
            Duration: duration,
            ObjKey: objKey,
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
          console.log("From vid: ", res[1].insertId);
          router.setParams({
            postID: res[1].insertId,
            duration: duration,
            vidUri: uri,
          });
          //testing which is triggering navigation
          router.push(
            `./chooseThumbnail?postID=${res[1].insertId}&duration=${duration}&vidUri=${uri}`
          );
          return res[1].insertId;
        });
    } catch (error) {
      console.log("DB upload error: ", error);
    }
  }

  return (
    // <LinearGradient
    //   colors={["#833ab4", "#8589d6", "#fcb045"]}
    //   start={{ x: 0.1, y: 0.2 }}
    //   style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    // >
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <TouchableOpacity
        onPress={() => {
          Alert.alert("Exiting Upload", "Are you sure you want to quit?", [
            {
              text: "Yes",
              onPress: () => router.navigate("../(tabs)/home"),
              style: "cancel",
            },
            {
              text: "No",
              style: "cancel",
            },
          ]);
        }}
        style={{ position: "absolute", top: "7%", left: "7%" }}
      >
        <AntDesign name="closecircle" size={50} color="white" />
      </TouchableOpacity>

      <Text className="text-center mt-3 text-2xl font-normal text-white px-7 py-7">
        Select a video to upload
      </Text>

      <TouchableOpacity
        onPress={async () => {
          await pickImage();
          console.log("*******************");
          // router.navigate("/uploadSheetMusic");
        }}
        className="bg-[#833ab4] mt-4 rounded-lg w-1/2 p-2"
      >
        <Text className="text-center text-base text-white ">
          Open Camera Roll
        </Text>
      </TouchableOpacity>

      <Button title={"Sitemap"} onPress={() => router.navigate("/_sitemap")} />
    </SafeAreaView>
    // </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
