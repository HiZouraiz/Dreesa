import TextField from "@/src/components/TextField";
import appStyle from "@/src/constants/Colors";
import React, { useState } from "react";
import {
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

export default function Register() {
  const [username, setUsername] = useState("");

  return (
    <SafeAreaView className="bg-white flex-1 relative">
      <View className="bg-white">
        <Image
          resizeMode="contain"
          className="w-12 h-12 m-5"
          source={require("../../src/assets/images/icons/back_icon.png")}
        />

        <View className=" items-center justify-center bg-white">
          <Text className=" text-4xl font-medium mb-1"> Welcome </Text>

          <Text className=" text-base text-gray-400">
            Please enter your data to continue
          </Text>

          <KeyboardAvoidingView behavior="position">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </SafeAreaView>
  );
}
