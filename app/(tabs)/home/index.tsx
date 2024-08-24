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
import { router } from "expo-router";

const uris = [
  "https://d49cod5usxzn4.cloudfront.net/Beat%20it%20Solo%20MJ%20&%20Eddie%20Van%20Halen.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Carnival%20-Ye%20Cover.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Die%20Hard.mp4",
  "https://d49cod5usxzn4.cloudfront.net/Eruption%20-%20Van%20Halen%20Cover.mp4",
];

export default function Tab() {
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
    <View style={styles.container}>
      <Text
        style={{
          top: Dimensions.get("window").height * 0.08,
          left: Dimensions.get("window").width * 0.08,
        }}
        className="z-10 absolute text-center text-white opacity-80 font-semibold text-3xl"
      >
        Vidz
      </Text>
      <FlatList
        //ref={videoO}
        data={uris}
        //initialScrollIndex={3}
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
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    </View>
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

// return (
//   // <View className="flex-1 justify-center items-center bg-white">

//   //   <ScrollView showsVerticalScrollIndicator={false} scrollsToTop={true}>
//   //     {/* <video width={800} height={500} loop autoPlay>
//   //       <source
//   //         src="https://d49cod5usxzn4.cloudfront.net/Beat%20it%20Solo%20MJ%20&%20Eddie%20Van%20Halen.mp4"
//   //         type="video/mp4"
//   //       />
//   //     </video> */}
//   //     <LickVid
//   //       uri={
//   //         "https://d49cod5usxzn4.cloudfront.net/Beat%20it%20Solo%20MJ%20&%20Eddie%20Van%20Halen.mp4"
//   //       }
//   //     />
//   //     <Pressable
//   //       className="h-screen w-screen"
//   //       onPress={() => {
//   //         status.isPlaying
//   //           ? video.current.pauseAsync()
//   //           : video.current.playAsync();
//   //         console.log(status);
//   //         console.log(video);
//   //       }}
//   //     >
//   //       <Video
//   //         className="w-full h-screen"
//   //         ref={video}
//   //         source={{
//   //           uri: "https://d49cod5usxzn4.cloudfront.net/Beat%20it%20Solo%20MJ%20&%20Eddie%20Van%20Halen.mp4",
//   //         }}
//   //         resizeMode={ResizeMode.COVER}
//   //         useNativeControls={false}
//   //         isLooping
//   //         // videoStyle={styles.video}
//   //         volume={0.5}
//   //         onPlaybackStatusUpdate={(status) => setStatus(() => status)}
//   //       />
//   //     </Pressable>

//   //     <Pressable
//   //       className="h-screen w-screen"
//   //       onPress={() =>
//   //         status.isPlaying
//   //           ? video1.current.pauseAsync()
//   //           : video1.current.playAsync()
//   //       }
//   //     >
//   //       <Video
//   //         className="w-full h-screen p-0 m-0"
//   //         ref={video1}
//   //         source={{
//   //           uri: "https://d49cod5usxzn4.cloudfront.net/Beat%20it%20Solo%20MJ%20&%20Eddie%20Van%20Halen.mp4",
//   //         }}
//   //         resizeMode={ResizeMode.COVER}
//   //         useNativeControls={false}
//   //         isLooping
//   //         // videoStyle={styles.video}
//   //         volume={0.5}
//   //         onPlaybackStatusUpdate={(status) => setStatus(() => status)}
//   //       />
//   //     </Pressable>
//   //   </ScrollView>
//   <Text>Hi</Text>
// );

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
