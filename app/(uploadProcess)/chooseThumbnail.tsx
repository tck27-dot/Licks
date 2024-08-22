import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  Dimensions,
} from "react-native";
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
import ThumbnailSelector from "@/components/ThumbnailSelector";
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
  const params = useGlobalSearchParams<{
    postID: string;
    duration: string;
    vidUri: string;
  }>();
  const [isLoading, toggleLoading] = useState<boolean>(false);
  const [isSubmitting, toggleSubmit] = useState<boolean>(false);
  const [vidUri, setVidUri] = useState<string | null>(null);
  const [opacity, setOpacity] = useState<number>(1);
  useEffect(() => {
    // Update the state with the postID value
    if (params.postID) {
      setPostID(params.postID);
      setDuration(params.duration);
    }
  }, [params]);
  console.log("From chooseThumbnail: ", postID, duration);

  function handleImage(image: string) {
    return image;
  }

  useEffect(() => {
    const getVid = async () => {
      if (params.postID) {
        try {
          const result = await fetch(
            `http://192.168.50.70:8084/getVideoFile/${params.postID}`
          );
          if (result.ok) {
            const data = await result.json();
            const { url } = data;
            url && setVidUri(url);
            console.log(url);
          }
        } catch (e) {
          console.log("Error fetching video: ", e);
        }
      }
    };
    getVid();
  }, [postID]);
  // Put back in after thumbnail implementation!!!!!
  // !postID && !vidUri && alert("Error loading media");
  return (
    <>
      <SafeAreaView
        style={{ opacity: opacity }}
        className="flex-1  justify-center center bg-black"
      >
        <Text className="text-center mt-3 text-2xl font-bold text-white">
          Choose Thumbnail
        </Text>
        <Text className="text-center font-medium text-xs px-7 py-4 text-[#bebcbc]">
          Adjust the slider to find a moment to thumbnail
        </Text>
        {/* Put back in after Thumbnail implementation!!!! */}
        {postID && vidUri && (
          <ThumbnailSelector
            duration={duration ? Number(duration) : 38000}
            onImgGenerated={handleImage}
            shouldShouldSubmit={isSubmitting}
            postID={postID}
            vidUri={vidUri}
          />
        )}
        {/* <ThumbnailSelector
          duration={duration ? Number(duration) : 38000}
          onImgGenerated={handleImage}
          shouldShouldSubmit={isSubmitting}
          postID={postID ? postID : "1"}
          vidUri={
            vidUri
              ? vidUri
              : "https://licks-bucket-2.s3.us-east-1.amazonaws.com/6b0721557057e9520e1dbd52f4682e87"
          }
        /> */}
        <Pressable
          onPress={() => {
            toggleLoading(true);
            console.log(isSubmitting);
            toggleSubmit(true);
            setOpacity(0.7);
          }}
          className="bg-[#833ab4] mt-4 p-2 rounded-lg my-0 mx-auto w-2/3"
        >
          <Text className="text-center text-base text-white">
            Choose and continue
          </Text>
        </Pressable>

        <Button
          title={"Sitemap"}
          onPress={() => router.navigate("/_sitemap")}
        />
      </SafeAreaView>
      <View
        style={{
          top: Dimensions.get("window").height / 2,
          right: Dimensions.get("window").width / 2 - 20,
          position: "absolute",
          zIndex: 1,
        }}
        className=""
      >
        {isLoading && (
          <ActivityIndicator
            size={"large"}
            className="py-2"
            animating={isLoading}
            color={"black"}
          />
        )}
      </View>
    </>
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
    width: "75%",
    height: "10%",
  },
  test_image: {
    width: "75%",
    height: "75%",
  },
});
