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
export default function profile() {
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
  console.log(uid, follower, following, Videos, firstName, lastName);

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
          console.log(data);
          const userData = data[0].userData;
          setBio(userData.bio);
          setFollowers(data[0].followers);
          setFollowing(data[0].following);
          setVideos(data.videos);
          setProfileName(userData.profile_name);
          setFirstName(userData.first_name);
          setLastName(userData.last_name);
          setProfile_image(userData.profile_img);
        }
      } catch (err) {
        console.log(err);
      }
    }
    if (uid) {
      console.log("ran getdeets");
      getDetails(uid);
    }
  }, [uid, refreshing]);

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
          <PostGrid isEmpty={true} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
