import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Button,
  FlatList,
  Dimensions,
} from "react-native";
import { StatusBar, setStatusBarHidden } from "expo-status-bar";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore/lite";

import { useState, useEffect, useRef, useCallback } from "react";
import { Video, ResizeMode } from "expo-av";
import * as React from "react";
import { StyleSheet } from "react-native";
import {
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
  RefreshControl,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ButtonColumn from "@/components/ButtonColumn";
import { router } from "expo-router";
import { useFocusEffect } from "expo-router";
import Comments from "@/components/Comments";
import PostDescription from "@/components/PostDescription";
import { usePosts } from "@/components/utils/PostContext";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import Post from "@/types/post";
let uris = [
  "https://d49cod5usxzn4.cloudfront.net/Beat%20it%20Solo%20MJ%20&%20Eddie%20Van%20Halen.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Carnival%20-Ye%20Cover.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Die%20Hard.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Eruption%20-%20Van%20Halen%20Cover.mp4",
];

export default function Tab() {
  const { posts, addPosts } = usePosts();
  const [uid, setUid] = useState<null | string>(null);
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setUid(user.uid);
    } else {
      console.log("User Signed Out");
    }
  });
  const [follower, setFollowers] = useState<string | null>(null);
  const [following, setFollowing] = useState<string | null>(null);
  const [Videos, setVideos] = useState<string | null>(null);
  const [profile_image, setProfile_image] = useState<string | null>(null);
  const [profile_name, setProfileName] = useState<string | null>(null);
  const [bio, setBio] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [postInfo, setPostInfo] = useState<Post[] | null>(null);
  //console.log(uid, follower, following, Videos, firstName, lastName);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    async function getDetails(uid: string) {
      try {
        const params = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Uid: uid,
          }),
        };
        const results = await fetch(
          "http://192.168.50.70:8084/getUserInfo",
          params
        );

        if (results.ok) {
          console.log(201);
          const data = await results.json();
          //console.log(data);
          const userData = data[0].userData;
          const postData = data[1];

          setBio(userData.bio);
          setFollowers(data[0].followers);
          setFollowing(data[0].following);
          setProfileName(userData.profile_name);
          setFirstName(userData.first_name);
          setLastName(userData.last_name);
          setProfile_image(userData.profile_img);
        }
      } catch (err) {
        console.log(err);
      }
    }
    async function getPosts(uid: string) {
      console.log("Running get Posts...");
      try {
        const response = await fetch(
          "http://192.168.50.70:8084/getposts/" + uid
        );
        if (response.ok) {
          console.log(201);
          const data = await response.json();
          addPosts(data);
          setPostInfo(data);
          setVideos(data.length);
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (uid) {
      console.log("ran getdeets");
      getDetails(uid);
      getPosts(uid);
    }
  }, [uid, refreshing]);
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([
    { viewabilityConfig, onViewableItemsChanged },
  ]);
  return (
    <View style={{ backgroundColor: "black" }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={styles.container}
      >
        <Text
          style={{
            top: Dimensions.get("window").height * 0.08,
            left: Dimensions.get("window").width * 0.08,
          }}
          className="z-10 absolute text-center text-white opacity-80 font-semibold text-3xl"
        >
          Vidz
        </Text>
      </ScrollView>
      <FlatList
        //ref={videoO}
        data={posts}
        //initialScrollIndex={3}
        renderItem={({ item, index }) => (
          <Item
            key={index}
            item={item.media_file}
            shouldPlay={index === currentViewableItemIndex}
          />
        )}
        keyExtractor={(item) => item.post_id}
        pagingEnabled
        getItemLayout={(data, index) => ({
          length: Dimensions.get("screen").height - 79,
          offset: (Dimensions.get("screen").height - 79) * index,
          index,
        })}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    </View>
  );
}
const Item = ({ item, shouldPlay }: { shouldPlay: boolean; item: string }) => {
  const video = React.useRef<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [visible, setVisibility] = useState<boolean>(false);
  useEffect(() => {
    if (!video.current) return;

    if (shouldPlay) {
      video.current.playAsync();
      router.setParams({ currentPostID: item });
    } else {
      video.current.pauseAsync();
      video.current.setPositionAsync(0);
    }
  }, [shouldPlay]);

  useFocusEffect(
    useCallback(() => {
      // Function to run when the screen is focused
      return () => {
        // Function to run when the screen is unfocused
        if (video.current) {
          video.current.pauseAsync(); // Pause the video when the screen is not visible
        }
      };
    }, [])
  );
  return (
    <Pressable
      onPress={() => {
        status.isPlaying
          ? video.current.pauseAsync()
          : video.current.playAsync();
      }}
    >
      <View style={styles.VideoContainer}>
        <Video
          ref={video}
          source={{ uri: item }}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
        <ButtonColumn style={styles.buttonColumn} />
        <Comments isVisible={visible} />
        <PostDescription
          style={{
            top: Dimensions.get("window").height * 0.8,
            right: Dimensions.get("window").width * 0.55,
            position: "absolute",
          }}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    zIndex: 1,
  },
  video: {
    width: "100%",
    height: Dimensions.get("window").height - 79,
  },
  VideoContainer: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 79,
    zIndex: 0,
  },
  buttonColumn: {
    position: "relative",
    bottom: "30%",
    left: "85%",
    zIndex: 1,
    height: 300,
  },
});
