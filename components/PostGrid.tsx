import { View, Text } from "react-native";
import React from "react";

interface Props {
  /**  Renders splashscreen if no videos are uploaded*/
  isEmpty: Boolean;
  isCentered?: Boolean;
}
export default function PostGrid({ isEmpty, isCentered }: Props) {
  const centered = isCentered ? "text-center" : "";
  return (
    <View
      style={{
        backgroundColor: "white",
        height: "100%",
      }}
    >
      {isEmpty && (
        <Text
          style={{
            textAlign: "center",
            paddingVertical: "50%",
            color: "grey",
            fontWeight: 300,
            fontSize: 35,
          }}
        >
          No Posts
        </Text>
      )}
    </View>
  );
}
