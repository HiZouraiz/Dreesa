import appStyle from "../../src/constants/Colors";

import React from "react";
import { Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function Checkout() {
  return (
    <SafeAreaView className={`bg-white flex-1 items-center justify-center`}>
      <Image
        resizeMode="contain"
        className="w-[100%] h-[100%] mt-[-30%]"
        source={appStyle.ORDER_CONFIRM_IMAGE}
      />
      <Text className="text-3xl mt-[-92%] font-semibold text-black">
        Order Confirmed!
      </Text>
      <Text className="text-[16px] text-gray-400 text-center p-3 pt-2">
        Your order has been confirmed, we will send you confirmation email
        shortly.
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/orders")}
        className="bg-gray-100 w-[75%] items-center p-3 rounded-2xl mt-[5%]"
      >
        <Text className="text-gray-500 text-[18px]">Go to Orders</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
