import { Tabs } from "expo-router";
import { View, Image, Platform } from "react-native";

export default () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === "android" ? 60 : 90,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View className="items-center pt-[16px]">
                <Image
                  source={
                    focused
                      ? require("../../src/assets/images/Tabs/1.0.png")
                      : require("../../src/assets/images/Tabs/1.png")
                  }
                  resizeMode="contain"
                  className="w-[26px] h-[26px]"
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View className="items-center pt-[16px]">
                <Image
                  source={
                    focused
                      ? require("../../src/assets/images/Tabs/2.0.png")
                      : require("../../src/assets/images/Tabs/2.png")
                  }
                  resizeMode="contain"
                  className="w-[26px] h-[26px]"
                />
              </View>
            );
          },
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          headerShown: false,
          title: "",
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            return (
              <View className="items-center pt-[16px]">
                <Image
                  source={
                    focused
                      ? require("../../src/assets/images/Tabs/3.0.png")
                      : require("../../src/assets/images/Tabs/3.png")
                  }
                  resizeMode="contain"
                  className="w-[26px] h-[26px]"
                />
              </View>
            );
          },
        }}
      />
    </Tabs>
  );
};
