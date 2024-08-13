import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack initialRouteName="setName">
      <Stack.Screen
        name="setNames"
        options={{
          // Set the presentation mode to modal for our modal route.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="chooseName"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="choosePhoto"
        options={{
          // Set the presentation mode to modal for our modal route.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="congratulations"
        options={{
          // Set the presentation mode to modal for our modal route.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="setBio"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
