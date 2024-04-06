import { useFocusEffect } from "@react-navigation/native";
import appStyle from "../../src/constants/Colors";

import { router } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        router.push("/(tabs)/home");
      }, 1500);
    }, [router])
  );

  return (
    <SafeAreaView
      className={`flex-1 items-center justify-center`}
      style={{ backgroundColor: appStyle.Colors.primaryColor }}
    >
      <Image
        resizeMode="contain"
        className="w-[250px] h-[250px]"
        source={appStyle.SPLASH_ICON}
      />
      <Image
        resizeMode="contain"
        className="w-[280px] h-[110px] mt-2"
        source={appStyle.SPLASH_LOGO}
      />
    </SafeAreaView>
  );
}
