import { View, Text, SafeAreaView, Image, Button } from "react-native";
import React from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import PostGrid from "@/components/PostGrid";
export default function profile() {
  let uid = "";
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      uid = user.uid;
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

  (async function getDetails(uid: string) {
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
      )
        .then((res) => res.json())
        .then((data) => {
          setBio(data.bio);
          setFollowers(data.followers);
          setFollowing(data.following);
          setVideos(data.videos);
          setProfile_image(data.profileImg);
          setProfileName(data.profileName);
          setFirstName(data.firstName);
          setLastName(data.lastName);
        });
    } catch (err) {
      console.log(err);
    }
  })(uid);

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
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
              uri: "https://licks-bucket-2.s3.amazonaws.com/f42f379a1a1e0ed723f83577637b85df",
            }}
          />
          <Text className="text-center font-semibold pt-4">{`${
            firstName ? firstName : "Random"
          } ${lastName ? lastName : "Dude"}`}</Text>
          <Text className="text-center text-lg py-2 font-semibold">
            {profile_name ? profile_name : "@RandomGuy"}
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
    </SafeAreaView>
  );
}
