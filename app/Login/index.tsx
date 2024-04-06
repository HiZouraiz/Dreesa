import ButtonOne from "../../src/components/ButtonOne";

import { router } from "expo-router";
import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import appStyle from "../../src/constants/Colors";
import LottieView from "lottie-react-native";
import { useDispatch } from "react-redux";
import { loginUser } from "../../src/redux/Slice/AuthSlice";
import { getCurrentUserProfile, Login } from "../../src/api/helper";

export default function index() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const loginAccount = async () => {
    if (!username) {
      Alert.alert("Field Empty!", "Please enter your username");
      return;
    } else if (!password) {
      Alert.alert("Field Empty!", "Please enter your password");
      return;
    } else if (password.length < 6) {
      Alert.alert(
        "Password characters!",
        "Please enter a minimum of 6 characters"
      );
      return;
    } else {
      setLoading(true);

      let STATUS_CODE: any;

      Login(username, password).then((response) => {
        STATUS_CODE = response.status;

        response
          .json()
          .then((responseJson) => {
            if (
              STATUS_CODE === 403 &&
              responseJson.code === "[jwt_auth] invalid_username"
            ) {
              setLoading(false);
              Alert.alert(
                "Invalid!",
                "This username is invalid please try correct one."
              );

              return;
            }

            if (
              STATUS_CODE === 403 &&
              responseJson.code === "[jwt_auth] invalid_email"
            ) {
              setLoading(false);
              Alert.alert(
                "Invalid!",
                "This email is invalid please try correct one."
              );

              return;
            }

            if (
              STATUS_CODE === 403 &&
              responseJson.code === "[jwt_auth] incorrect_password"
            ) {
              setLoading(false);
              Alert.alert(
                "Invalid!",
                "Password is invalid please try correct one."
              );

              return;
            }
            getUserProfile(
              `${responseJson.token}`,
              `${responseJson.user_email}`
            );
          })

          .catch((error) => {
            setLoading(false);
            console.log(error);
          });
      });
    }
  };

  const getUserProfile = (token: any, user_email: any) => {
    getCurrentUserProfile(token)
      .then((response) => response.json())
      .then((profileData) => {
        const userData = {
          token,
          user_email,
          id: profileData.id,
          username: profileData.name,
          userImage: profileData.avatar_urls["96"],
        };
        dispatch(loginUser(userData));
        router.push("/(tabs)/home");
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
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
      <ScrollView>
        <View className=" items-center justify-center bg-white mt-[20%]">
          <Text className=" text-4xl font-medium mb-1"> Welcome </Text>

          <Text className=" text-base text-gray-400">
            Please enter your data to continue
          </Text>
        </View>

        <View className="gap-12 p-[20px] mt-[5%]">
          <View
            className={`flex-row  px-4 bg-white item-center rounded-2xl border-b border-[${appStyle.Colors.lightGrayColor}] border-opacity-100 pb-3`}
          >
            <TextInput
              className="flex-1 text-neutral-700 text-[18px] pr-5"
              placeholder="Username"
              placeholderTextColor={"gray"}
              value={username}
              onChange={(event) => setUsername(event.nativeEvent.text)}
            />
          </View>

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
        </View>

        <View className="flex flex-row justify-end gap-12 p-[25px] pt-0">
          <TouchableOpacity onPress={() => router.push("/ForgotPassword/")}>
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

        <View className="p-[30px] mt-10 items-center justify-center">
          <Text className=" text-base text-gray-400 text-center text-[15px]">
            By connecting your account confirm that you agree with our{" "}
            <Text className="text-black font-medium">Term and Condition</Text>
          </Text>
        </View>

        <View className="p-[30px] pt-0 items-center justify-center mb-2">
          <TouchableOpacity onPress={() => router.push("/Register/")}>
            <Text className=" text-base text-gray-400 text-center text-[17px]">
              Don't have an account?{" "}
              <Text
                className={`font-medium`}
                style={{ color: appStyle.Colors.primaryColor }}
              >
                Sign up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ButtonOne text="Login" onPress={() => loginAccount()} />
    </SafeAreaView>
  );
}
