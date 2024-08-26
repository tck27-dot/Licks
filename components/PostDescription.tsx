import { View, Text, ViewStyle, StyleProp, Image } from "react-native";
import React from "react";

type Props = {
  style?: StyleProp<ViewStyle>;
};

export default function PostDescription({ style }: Props) {
  return (
    <View style={style}>
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "baseline",
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image
            style={{ height: 40, width: 40, borderRadius: 20 }}
            source={{
              uri: "https://licks-bucket-2.s3.amazonaws.com/f42f379a1a1e0ed723f83577637b85df",
            }}
          />
          <Text
            style={{
              color: "white",
              fontSize: 16,
              textAlign: "center",
              paddingVertical: "2.9%",
              fontWeight: "400",
            }}
          >
            TmoneyMusic
          </Text>
        </View>

        <Text
          style={{
            color: "white",
            fontSize: 12,
            textAlign: "center",
            fontWeight: "400",
            paddingTop: 2,
          }}
        >
          Eruption by Eddie Van Halen!
        </Text>
      </View>
    </View>
  );
}
