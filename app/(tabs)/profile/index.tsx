import {
  View,
  Text,
  SafeAreaView,
  Image,
  Button,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useCallback } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostGrid from "@/components/PostGrid";
import Post from "@/types/post";
import { usePosts } from "@/components/utils/PostContext";
export default function profile() {
  const ip = process.env.EXPO_PUBLIC_IP_ADDRESS;
  console.log("Ip in profile: ", ip);
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
        const results = await fetch(`http://${ip}:8084/getUserInfo`, params);

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
        const response = await fetch(`http://${ip}:8084/getposts/` + uid);
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
  //postInfo && console.log(postInfo);
  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        style={{ height: "100%" }}
      >
        {/* Heading */}
        <View className="flex flex-row pb-7 border-b-2">
          {/* User Stats Column */}
          <View className="flex flex-col justify-around  basis-1/4">
            <Text className="text-center font-medium text-base">Followers</Text>
            <Text className="text-center font-medium text-base">
              {follower ? follower : 0}
            </Text>
            <Text className="text-center font-medium text-base">Following</Text>
            <Text className="text-center font-medium text-base">
              {following ? following : 0}
            </Text>
            <Text className="text-center font-medium text-base">Videos</Text>
            <Text className="text-center font-medium text-base">
              {Videos ? Videos : 0}
            </Text>
          </View>
          {/* Image-Bio-Username Section */}
          <View className="flex flex-col basis-1/2">
            <Image
              style={{
                height: 100,
                width: 100,
                margin: "auto",
                borderRadius: 50,
              }}
              source={{
                uri: profile_image
                  ? profile_image
                  : "https://licks-bucket-2.s3.amazonaws.com/f42f379a1a1e0ed723f83577637b85df",
              }}
            />
            <Text className="text-center font-semibold pt-4">{`${
              firstName ? firstName : "Random"
            } ${lastName ? lastName : "Dude"}`}</Text>
            <Text className="text-center text-lg py-2 font-semibold">
              {profile_name ? `@${profile_name}` : "@RandomGuy"}
            </Text>
            <Text className="text-center">
              {bio ? bio : "Set a bio for your page!"}
            </Text>
          </View>
          {/* Settings Button */}
          <View className="basis-1/4">
            <Ionicons
              style={{ left: "50%" }}
              name="settings-outline"
              size={30}
              color="black"
            />
          </View>
        </View>
        {/* Post Grid */}
        <View>
          <PostGrid postData={postInfo} isEmpty={Videos ? false : true} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
