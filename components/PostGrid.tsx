import { View, Text, Image, Dimensions, Pressable } from "react-native";
import React from "react";
import Post from "@/types/post";
import { router } from "expo-router";

interface Props {
  /**  Renders splashscreen if no videos are uploaded*/
  isEmpty: Boolean;
  isCentered?: Boolean;
  postData?: Post[] | null;
}

export default function PostGrid({ isEmpty, isCentered, postData }: Props) {
  const centered = isCentered ? "text-center" : "";

  const Images: React.FC<{ posts: Post[] }> = ({ posts }): JSX.Element => {
    return (
      <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
        {posts.map((obj: Post, index) => (
          <Pressable
            onPress={() => {
              console.log(index);
              router.setParams({ postPlayerID: index });
              router.push(`/(tabs)/profile/PostPlayer?postPlayerID=${index}`);
            }}
          >
            <Image
              style={{ height: 245, width: Dimensions.get("window").width / 3 }}
              source={{ uri: obj.thumbnail_file }}
            />
          </Pressable>
        ))}
      </View>
    );
  };
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
      {postData && <Images posts={postData} />}
    </View>
  );
}
