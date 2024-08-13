import { View, Text, Button, StyleSheet, Image } from "react-native";
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

interface Props {
  duration: number;
  onImgGenerated: (image: string) => void;
}
export default function MySlider({ duration, onImgGenerated }: Props) {
  const [value, setValue] = useState(0);
  const [image, setImage] = useState<string | null>(null);
  const [isShown, toggleShown] = useState<boolean>(true);
  const isFirstRender = useRef(true);

  //Generating Thumbnail
  useEffect(() => {
    if (isFirstRender.current) {
      const renderImage = async () => {
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(
            "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
            {
              time: 0,
            }
          );
          setImage(uri);
          // toggleShown(false);
        } catch (e) {
          console.warn(e);
        }
      };
      renderImage();
      isFirstRender.current = false;
      return;
    }
    const generateThumbnail = async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4",
          {
            time: value,
          }
        );
        setImage(uri);
      } catch (e) {
        console.warn(e);
      }
    };
    generateThumbnail();
  }, [value]);

  useEffect(() => {
    image && onImgGenerated(image);
  }, [image, onImgGenerated]);

  const SliderExample = (props: SliderProps) => {
    return (
      <View style={{ alignItems: "center" }}>
        {/* <Text style={styles.text}>{value && +value.toFixed(3)}</Text> */}

        {image && <Image style={styles.image} source={{ uri: image }} />}
        <Slider
          step={500}
          style={[styles.slider, props.style]}
          {...props}
          value={value}
          maximumValue={duration ? Number(duration) : 0}
          minimumValue={0}
          onSlidingComplete={(value) => {
            setValue(value);
          }}
        />
      </View>
    );
  };
  return <SliderExample />;
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
