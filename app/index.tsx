import TextField from "@/src/components/TextField";
import React, { useState } from "react";
import {
  Text,
  View,
  KeyboardAvoidingView,
  StatusBar,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function index() {
  const [username, setUsername] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView>
        <View className=" items-center justify-center bg-white mt-[20%]">
          <Text className=" text-4xl font-medium mb-1"> Welcome </Text>

          <Text className=" text-base text-gray-400">
            Please enter your data to continue
          </Text>
        </View>

        <View className="gap-12 p-[20px] mt-[20%]">
          <View className="flex-row  px-4 bg-white item-center rounded-2xl border-b border-[#E7E8EA] border-opacity-100 pb-3">
            <TextInput
              className="flex-1 text-neutral-700 text-[18px] pr-5"
              placeholder="Username"
              placeholderTextColor={"gray"}
            />
          </View>
          <View className="flex-row  px-4 bg-white item-center rounded-2xl border-b border-[#E7E8EA] border-opacity-100 pb-3">
            <TextInput
              className="flex-1 text-neutral-700 text-[18px] pr-5"
              placeholder="Password"
              placeholderTextColor={"gray"}
            />
          </View>
        </View>

        <View className="flex flex-row justify-end gap-12 p-[25px] pt-3">
          <TouchableOpacity>
            <Text className="text-[#EA4335] text-[18px]">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between items-center p-[15px] pl-9">
          <Text className="text-[16px] text-black font-medium">
            Remember me
          </Text>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            trackColor={{ false: "#dddddd", true: "#33C458" }}
            thumbColor={rememberMe ? "#ffffff" : "#ffffff"}
          />
        </View>
      </ScrollView>

      <View className="p-[30px] items-center justify-center mb-2">
        <Text className=" text-base text-gray-400 text-center text-[15px]">
          By connecting your account confirm that you agree with our{" "}
          <Text className="text-black font-medium">Term and Condition</Text>
        </Text>
      </View>

      <TouchableOpacity className="bg-[#9775FA] p-5 items-center justify-center">
        <Text className="text-white text-[18px]">Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
