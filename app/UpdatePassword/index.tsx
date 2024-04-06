import ButtonOne from "../../src/components/ButtonOne";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";

import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Text, View, TextInput, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { updateCurrentUserPassword } from "../../src/api/helper";
import LottieView from "lottie-react-native";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../src/redux/Slice/AuthSlice";

export default function index() {
  const paramItem = useLocalSearchParams();
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const UpdatePassowrd = () => {
    if (!password) {
      Alert.alert("Field Empty!", "Please enter your password");
    } else if (password.length < 6) {
      Alert.alert(
        "Password characters!",
        "Please enter a minimum of 6 characters"
      );
    } else if (confirmPassword !== password) {
      Alert.alert("Password mismatch!", "Password do not match.");
    } else {
      setLoading(true);

      let STATUS_CODE: any;

      updateCurrentUserPassword(
        paramItem["token"],
        paramItem["id"],
        confirmPassword
      ).then((response) => {
        STATUS_CODE = response.status;

        response
          .json()
          .then((responseJson) => {
            if (
              STATUS_CODE === 403 &&
              responseJson.code === "jwt_auth_invalid_token"
            ) {
              setLoading(false);
              Alert.alert("Sorry!", "Auth Session Expired.");

              dispatch(logoutUser());
              router.push("/Login/");
              return;
            }

            Alert.alert(
              "Password Changed!",
              "Your password has been change successfully."
            );
            router.back();
          })

          .catch((error) => {
            setLoading(false);
            console.log(error);
          });
      });
    }
  };

  if (loading === true) {
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
          <Text className=" text-4xl font-medium mb-1"> New Password </Text>
        </View>

        <View className="flex items-center justify-center mt-[-60px]">
          <Image
            resizeMode="contain"
            className="w-[350px] h-[350px]"
            source={require("../../src/assets/images/icons/verification.png")}
          />
        </View>

        <View className="gap-12 p-[20px] pt-0">
          <View
            className={`flex-row  px-4 bg-white item-center rounded-2xl border-b border-[${appStyle.Colors.lightGrayColor}] border-opacity-100 pb-3`}
          >
            <TextInput
              className="flex-1 text-neutral-700 text-[18px] pr-5"
              placeholder="Password"
              placeholderTextColor={"gray"}
              value={password}
              onChange={(event) => setPassword(event.nativeEvent.text)}
            />
          </View>

          <View
            className={`flex-row  px-4 bg-white item-center rounded-2xl border-b border-[${appStyle.Colors.lightGrayColor}] border-opacity-100 pb-3`}
          >
            <TextInput
              className="flex-1 text-neutral-700 text-[18px] pr-5"
              placeholder="Confirm Password"
              placeholderTextColor={"gray"}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.nativeEvent.text)}
            />
          </View>
        </View>
      </ScrollView>

      <View className="p-[30px] mt-10 items-center justify-center">
        <Text className=" text-base text-gray-400 text-center text-[15px]">
          Please write your new password.
        </Text>
      </View>

      <ButtonOne text="Reset Password" onPress={() => UpdatePassowrd()} />
    </SafeAreaView>
  );
}
