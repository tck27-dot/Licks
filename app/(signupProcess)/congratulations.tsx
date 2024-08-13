import { View, Text, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
export default function congratulations() {
  return (
    <LinearGradient
      colors={["#833ab4", "#8589d6", "#fcb045"]}
      start={{ x: 0.1, y: 0.2 }}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <SafeAreaView>
        <Text className="text-center mt-3 text-2xl font-normal text-white">
          Congratulations, your all set!
        </Text>

        <Button
          title={"Enter into a new musical dimension!"}
          onPress={() => {
            router.navigate("../(tabs)/home");
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
