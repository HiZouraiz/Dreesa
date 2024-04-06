import ButtonOne from "../../src/components/ButtonOne";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";

import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import { Text, View, TextInput, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { forgotPassword } from "../../src/api/helper";

export default function index() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendLink = async () => {
    if (!email) {
      Alert.alert("Empty!", "Please enter your email address");
      return;
    }
    setLoading(true);

    let STATUS_CODE: any;

    forgotPassword(email).then((response) => {
      STATUS_CODE = response.status;
      response.json().then((responseJson) => {
        if (STATUS_CODE === 200) {
          setLoading(false);
          Alert.alert(
            "Success!",
            "A password reset email has been sent to your email address"
          );
          router.push({ pathname: "/Verification/", params: { email: email } });
          return;
        } else if (
          responseJson.message === "No user found with this email address."
        ) {
          setLoading(false);
          Alert.alert("Invalid!", "No user found with this email address.");
          return;
        } else {
          setLoading(false);
          Alert.alert(
            "Sorry!",
            "Something went wrong please try again in a while."
          );
          return;
        }
      });
    });
  };

  if (loading) {
    return (
      <View className="justify-center flex-1 items-center bg-white">
        <LottieView
          style={{
            width: "80%",
            height: "80%",
          }}
          source={appStyle.LOADER_FILE}
          loop={true}
          autoPlay
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <Header
        leftImage={appStyle.BACK_ICON_IMAGE}
        onLeftPress={() => router.back()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className=" items-center justify-center bg-white">
          <Text className=" text-4xl font-medium mb-1"> Forgot Password </Text>
        </View>

        <View className="flex items-center justify-center">
          <Image
            resizeMode="contain"
            className="w-[350px] h-[350px]"
            source={require("../../src/assets/images/icons/verification.png")}
          />
        </View>

        <View className=" p-[20px] pt-[0px]">
          <View
            className={`flex-row  px-4 bg-white item-center rounded-2xl border-b border-[${appStyle.Colors.lightGrayColor}] border-opacity-100 pb-3`}
          >
            <TextInput
              className="flex-1 text-neutral-700 text-[18px] pr-5"
              placeholder="Email Address"
              placeholderTextColor={"gray"}
              value={email}
              onChange={(event) => setEmail(event.nativeEvent.text)}
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-[30px] mt-10 items-center justify-center">
        <Text className=" text-base text-gray-400 text-center text-[15px]">
          Please write your email to receive a confirmation code to set a new
          password.
        </Text>
      </View>

      <ButtonOne text="Confirm Email" onPress={() => sendLink()} />
    </SafeAreaView>
  );
}
