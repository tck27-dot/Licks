import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Button,
  TextInput,
} from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useGlobalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";

export default function allSet() {
  return (
    <LinearGradient
      colors={["#833ab4", "#8589d6", "#fcb045"]}
      start={{ x: 0.1, y: 0.2 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <SafeAreaView>
        <Text className="text-center mt-3 text-2xl font-normal text-white">
          Your post has been submitted!
        </Text>

        <Button
          title={"Exit back to Home"}
          onPress={async () => {
            router.navigate("../(tabs)/home");
          }}
        />
        <Button
          title={"Sitemap"}
          onPress={() => router.navigate("/_sitemap")}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
