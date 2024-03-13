import { Stack } from "expo-router";
import { View } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function Layout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="Register/index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
