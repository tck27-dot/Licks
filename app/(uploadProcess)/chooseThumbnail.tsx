import { View, Text, Button, StyleSheet, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";
import Slider, {
  MarkerProps,
  SliderProps,
} from "@react-native-community/slider";
import MySlider from "@/components/MySlider";
export default function chooseThumbnail() {
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
  const [duration, setDuration] = useState<string | null>(null);

  const [image, setImage] = useState<string | null>(null);

  const params = useGlobalSearchParams<{ postID: string; duration: string }>();

  useEffect(() => {
    // Update the state with the postID value
    if (params.postID) {
      setPostID(params.postID);
      setDuration(params.duration);
    }
  }, [params]);
  console.log("From chooseThumbnail: ", postID, duration);
  const [file_uri, setfile_uri] = useState("");
  //Generating Thumbnail
  // const generateThumbnail = useCallback(async () => {
  //   try {
  //     const { uri } = await VideoThumbnails.getThumbnailAsync(
  //       "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
  //       {
  //         time: value,
  //       }
  //     );
  //     setImage(uri);
  //     console.log(value);
  //   } catch (e) {
  //     console.warn(e);
  //   }
  // }, [value]);
  // const pickDoc = async () => {
  //   let result = await DocumentPicker.getDocumentAsync();
  //   console.log(result);
  //   if (result.canceled) {
  //     console.log("error");
  //   }
  //   if (!result.canceled) {
  //     const resp = await fetch(result.assets[0].uri);
  //     const blob = await resp.blob();
  //     const uri = await putMedia(blob);
  //     postID && (await thumbnailUriToDB(uri, postID));
  //     postID && router.setParams({ postID: postID });
  //     console.log("From sheetmusic: *******************");
  //     router.push(`./uploadSheetMusic?postID=${postID}`);
  //   }
  // };

  // async function putMedia(image: Blob) {
  //   let { url } = await fetch("http://192.168.50.70:8084/s3Url").then((res) =>
  //     res.json()
  //   );

  //   const params = {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": image.type,
  //     },
  //     body: image,
  //   };

  //   const result = await fetch(url, params)
  //     .then((res) => console.log(res))
  //     .then((res) => setfile_uri(url.split("?")[0]))
  //     .catch((err) => console.log(err));
  //   console.log("View img here: ", url.split("?")[0]);
  //   const uri: string = url.split("?")[0];
  //   return uri;
  // }

  // async function thumbnailUriToDB(uri: string, postID: string) {
  //   try {
  //     const result = await fetch("http://192.168.50.70:8084/update_thumbnail", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         PostID: postID,
  //         Uri: uri,
  //       }),
  //     })
  //       .then((result) => {
  //         if (result.ok) {
  //           console.log(201);
  //           return result.json();
  //         }
  //       })
  //       .then((res) => {
  //         console.log(res);
  //         // router.setParams({ postID: res[0].insertId });
  //       });
  //   } catch (error) {
  //     console.log("DB upload error: ", error);
  //   }
  // }

  const SliderExample = (props: SliderProps) => {
    const [value, setValue] = useState(0);
    return (
      <View style={{ alignItems: "center" }}>
        <Text style={styles.text}>{value && +value.toFixed(3)}</Text>
        {image && <Image style={styles.image} source={{ uri: image }} />}
        <Slider
          step={1000}
          style={[styles.slider, props.style]}
          {...props}
          value={value}
          maximumValue={duration ? Number(duration) : 27000}
          minimumValue={0}
          onValueChange={(value) => {
            setValue(value);
            // generateThumbnail();
          }}
        />
      </View>
    );
  };

  function handleImage(image: string) {
    setImage(image);
  }

  return (
    <LinearGradient
      colors={["#833ab4", "#8589d6", "#fcb045"]}
      start={{ x: 0.1, y: 0.2 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <SafeAreaView>
        <Text className="text-center mt-3 text-2xl font-normal text-white">
          Choose Thumbnail
        </Text>
        <MySlider duration={27000} onImgGenerated={handleImage} />
        <Button
          title={"Sitemap"}
          onPress={() => router.navigate("/_sitemap")}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
    margin: 0,
  },
  divider: {
    width: 2,
    height: 20,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    width: 2,
    height: 20,
    backgroundColor: "#00629A",
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 10,
    width: 45,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    justifyContent: "center",
    alignItems: "center",
  },
  tinyLogo: {
    marginVertical: 5,
    aspectRatio: 1,
    flex: 1,
    height: "100%",
    width: "100%",
  },
  minMaxLabel: {
    flexDirection: "row",
    zIndex: -1,
  },
  slider: {
    width: 300,
    opacity: 1,
    marginTop: 10,
  },
  outer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#11FF11",
    justifyContent: "center",
    alignItems: "center",
  },
  outerTrue: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0F0FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#111111",
  },
  innerTrue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0F0FFF",
  },
  outerSmall: {
    width: 4,
    height: 4,
    top: 6,
    borderRadius: 2,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
  },
  outerTrueSmall: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: "#ABCDEF",
    justifyContent: "center",
    alignItems: "center",
  },
  innerSmall: {
    width: 7,
    height: 7,
    borderRadius: 1,
    backgroundColor: "#223366",
  },
  innerTrueSmall: {
    width: 7,
    height: 7,
    borderRadius: 1,
    backgroundColor: "#334488",
  },
  image: {
    width: 300,
    height: 600,
  },
});
