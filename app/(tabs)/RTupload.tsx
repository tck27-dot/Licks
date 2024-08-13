import { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default function Upload() {
  return (
    <LinearGradient
      colors={["#833ab4", "#8589d6", "#fcb045"]}
      start={{ x: 0.1, y: 0.2 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text className="text-center mt-3 text-2xl font-normal text-white">
          Upload Your Next Masterpiece!
        </Text>

        <TouchableOpacity
          onPress={() => router.navigate("../(uploadProcess)/chooseVid")}
          className="bg-[#833ab4] mt-4 p-2 rounded-lg w-1/2"
        >
          <Text className="text-center text-base text-white">Begin Upload</Text>
        </TouchableOpacity>

        <Button
          title={"Sitemap"}
          onPress={() => router.navigate("/_sitemap")}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
