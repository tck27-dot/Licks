import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack
      //screenOptions={{ gestureEnabled: false }}
      initialRouteName="chooseVid"
    >
      <Stack.Screen name="chooseVid" options={{ headerShown: false }} />
      <Stack.Screen name="uploadSheetMusic" options={{ headerShown: false }} />
      <Stack.Screen name="allSet" options={{ headerShown: false }} />
      <Stack.Screen name="chooseThumbnail" options={{ headerShown: false }} />
      <Stack.Screen name="chooseCaption" options={{ headerShown: false }} />
    </Stack>
  );
}
