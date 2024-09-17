import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Post from "@/types/post";
import { usePosts } from "./utils/PostContext";
import { AntDesign } from "@expo/vector-icons";
import { Router, useGlobalSearchParams } from "expo-router";

export default function LikeButton() {
  const { posts, addPosts } = usePosts();
  const data = posts;
  const params = useGlobalSearchParams<{ currentPostID: string }>();
  const firstRender = useRef<boolean>(true);
  const [currPost, setCurrPost] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [isLiked, toggleLiked] = useState<boolean>(false);
  const [numLikes, setNumLikes] = useState<string | null>(null);

  useEffect(() => {
    console.log("From likes: ", params.currentPostID);
    setCurrPost(params.currentPostID);
    let post = posts.find(
      (post) => post.ID.toString() === params.currentPostID
    );
    //post && setNumLikes(Number(post.likes));
    post && console.log(post.likes);
    post && setNumLikes(post.likes);
  }, [params]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const addLike = async (postID: string) => {
      const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postID: postID,
        }),
      };
      try {
        const result = await fetch("http://192.168.50.70:8084/addLike", params);
      } catch (e) {
        console.log(e);
      }
    };
    const removeLike = async (postID: string) => {
      const params = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postID: postID,
        }),
      };
      try {
        const result = await fetch(
          "http://192.168.50.70:8084/removeLike",
          params
        );
      } catch (e) {
        console.log(e);
      }
    };
    currPost && addLike(currPost);
  }, [isLiked]);
  return (
    <View>
      <Pressable
        onPress={() => {
          setColor("blue");
          toggleLiked(true);
          numLikes && setNumLikes((prev) => (Number(prev) + 1).toString());
        }}
      >
        <View style={{ display: "flex", gap: 5 }}>
          <AntDesign
            style={styles.Button}
            className={"m-"}
            name="like2"
            size={40}
            color={color ? color : "white"}
          />
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: 400,
              width: Dimensions.get("window").width * 0.1,
              textAlign: "center",
            }}
          >
            {numLikes}
          </Text>
        </View>
        {/* <View style={{ display: "flex", gap: 5 }}>
          <AntDesign
            style={styles.Button}
            className={"m-"}
            name="like2"
            size={40}
            color={color ? color : "white"}
          />
          {numLikes && (
            <Text
              style={{
                color: "white",
                fontSize: 15,
                fontWeight: 400,
                width: Dimensions.get("window").width * 0.1,
                textAlign: "center",
              }}
            >
              {/* {numLikes} */}
        {/* </Text>
          )}
        </View> */}
      </Pressable>
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
