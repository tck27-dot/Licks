import { View, Text, ViewStyle, Pressable } from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { StyleProp } from "react-native";
import { TextStyle } from "react-native";
import { router, Link } from "expo-router";
import Comments from "./Comments";
import LikeButton from "./LikeButton";

//Think about refactoring code in the future so that each
//Button has its own component tsx file. If someone presses
//a button we'll have more specific controll in a more readable
//way

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function ButtonColumn({ style }: Props) {
  const [visible, setVisibility] = useState<boolean>(true);
  const [isLiked, toggleLiked] = useState<boolean | undefined>(undefined);
  return (
    <View style={style}>
      <View style={styles.container}>
        {/* Like Button */}
        <LikeButton />
        {/* Comments Button */}
        <Pressable
          onPress={() => {
            setVisibility((prev) => !prev);
          }}
        >
          <FontAwesome
            style={styles.Button}
            name="comments"
            size={40}
            color="white"
          />
          <Comments isVisible={visible} />
        </Pressable>
        {/* SheetMusic Button */}
        <Link href="./home/sheetMusicModal">
          {/* <Pressable
            onPress={() => {
              alert("Soon this will show the sheet music for the video!");
            }}
          > */}
          <MaterialCommunityIcons
            style={styles.Button}
            name="music-clef-treble"
            size={50}
            color="white"
          />
          {/* </Pressable> */}
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Button: {
    width: 50,
  },
  container: {
    flex: 1,
    flexDirection: "column",
    rowGap: 40,
  },
});
