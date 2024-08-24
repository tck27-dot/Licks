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

import { useState, useEffect, useRef } from "react";
import { Video, ResizeMode } from "expo-av";
import * as React from "react";
import { StyleSheet } from "react-native";
import {
  ScrollView,
  SafeAreaView,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import ButtonColumn from "@/components/ButtonColumn";
import {
  router,
  useGlobalSearchParams,
  useLocalSearchParams,
} from "expo-router";
import { usePosts } from "@/components/utils/PostContext";
import Post from "@/types/post";
const uris = [
  "https://d49cod5usxzn4.cloudfront.net/Beat%20it%20Solo%20MJ%20&%20Eddie%20Van%20Halen.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Carnival%20-Ye%20Cover.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Die%20Hard.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Eruption%20-%20Van%20Halen%20Cover.mp4",
];

export default function Tab() {
  const [postPlayerID, setPostPlayerID] = useState<string | null>(null);
  const params = useGlobalSearchParams<{ postPlayerID: string }>();
  const { posts, addPosts } = usePosts();

  const uriArr = posts.map((post: Post) => {
    return post.media_file;
  });
  useEffect(() => {
    // Update the state with the postID value
    if (params.postPlayerID) {
      setPostPlayerID(params.postPlayerID);
      console.log(params.postPlayerID);
    }
  }, [params]);
  console.log(params.postPlayerID);
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
    postPlayerID && (
      <View style={styles.container}>
        <Text
          style={{
            top: Dimensions.get("window").height * 0.08,
            left: Dimensions.get("window").width * 0.08,
          }}
          className="z-10 absolute text-center text-white opacity-80 font-semibold text-3xl"
        ></Text>
        <FlatList
          //ref={videoO}
          data={uriArr}
          initialScrollIndex={Number(postPlayerID)}
          renderItem={({ item, index }) => (
            <Item item={item} shouldPlay={index === currentViewableItemIndex} />
          )}
          keyExtractor={(item) => item}
          pagingEnabled
          getItemLayout={(data, index) => ({
            length: Dimensions.get("screen").height - 79,
            offset: (Dimensions.get("screen").height - 79) * index,
            index,
          })}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          viewabilityConfigCallbackPairs={
            viewabilityConfigCallbackPairs.current
          }
        />
      </View>
    )
  );
}
const Item = ({ item, shouldPlay }: { shouldPlay: boolean; item: string }) => {
  const video = React.useRef<any>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!video.current) return;

    if (shouldPlay) {
      video.current.playAsync();
    } else {
      video.current.pauseAsync();
      video.current.setPositionAsync(0);
    }
  }, [shouldPlay]);

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
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
