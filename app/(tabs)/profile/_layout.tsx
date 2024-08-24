import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          // Hide the header for all other routes.
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostPlayer"
        options={{
          // Set the presentation mode to modal for our modal route.
          headerShown: false,
        }}
      />
    </Stack>
  );
}
