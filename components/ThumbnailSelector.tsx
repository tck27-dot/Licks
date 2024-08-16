import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Dimensions,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState, useEffect, useCallback, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import * as VideoThumbnails from "expo-video-thumbnails";
import Slider, {
  MarkerProps,
  SliderProps,
} from "@react-native-community/slider";
import { Video, ResizeMode } from "expo-av";

interface Props {
  duration: number;
  onImgGenerated: (image: string) => string;
  shouldShouldSubmit: boolean;
  postID: string;
  vidUri: string;
}
export default function ThumbnailSelector({
  duration,
  onImgGenerated,
  shouldShouldSubmit,
  postID,
  vidUri,
}: Props) {
  const [value, setValue] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [isShown, toggleShown] = useState<boolean>(true);
  const isFirstRender = useRef(true);
  useEffect(() => {
    image && onImgGenerated(image);
  }, [image, onImgGenerated]);

  //Main hook to run DB upload request
  useEffect(() => {
    if (isFirstRender.current) {
      console.log("***********************");
      console.log("First render!!");
      isFirstRender.current = false;
      return;
    }
    const thumbnailToDb = async (postID: string) => {
      try {
        //Generate Thumbnail
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          vidUri,

          {
            time: value,
          }
        );
        const resp = await fetch(uri);
        const blob = await resp.blob();

        //Upload Blob to S3
        let { url } = await fetch("http://192.168.50.70:8084/s3Url").then(
          (res) => res.json()
        );

        const params1 = {
          method: "PUT",
          headers: {
            "Content-Type": blob.type,
          },
          body: blob,
        };

        const result = await fetch(url, params1);
        const finalUri = url.split("?")[0];

        //DB Upload - Must have final uri!!
        const params = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ThumbnailUri: finalUri,
            PostID: postID,
          }),
        };
        const result2 = await fetch(
          "http://192.168.50.70:8084/update_thumbnail",
          params
        );

        if (!result2.ok) {
          throw new Error("request failed");
        }
      } catch (e) {
        console.log(e);
      }
    };
    thumbnailToDb(postID);
    router.setParams({ postID: postID });
    router.push(`/uploadSheetMusic?postID=${postID}`);
  }, [shouldShouldSubmit]);

  console.log("From slider: ", shouldShouldSubmit);

  const SliderExample = (props: SliderProps) => {
    const [status, setStatus] = useState<any>(null);
    const video = useRef<any>(null);
    return (
      <View style={{ alignItems: "center" }}>
        <Video
          ref={video}
          source={{
            uri: vidUri,
          }}
          style={styles.video}
          isLooping
          isMuted
          shouldPlay={false}
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        <Text className="text-white text-xl">{value}</Text>
        <Slider
          step={500}
          style={[styles.slider, props.style]}
          {...props}
          value={value}
          maximumValue={duration}
          minimumValue={0}
          onValueChange={async (value) => {
            if (video.current) {
              try {
                await video.current.setPositionAsync(value);
              } catch (e) {
                console.log(e);
              }
            }
          }}
        />
      </View>
    );
  };
  return <SliderExample />;
}

const styles = StyleSheet.create({
  video: {
    width: 260,
    height: 480,
    borderRadius: 24,
  },
  VideoContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 79,
    zIndex: 0,
  },
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
    width: 260,
    height: 480,
  },
});
