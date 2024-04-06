import ButtonOne from "../../src/components/ButtonOne";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";

import { router } from "expo-router";
import React, { useState } from "react";
import { Text, View, TextInput, ScrollView, Switch, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCurrentUserProfile, Login, Register } from "../../src/api/helper";
import LottieView from "lottie-react-native";
import { useDispatch } from "react-redux";
import { loginUser } from "../../src/redux/Slice/AuthSlice";

export default function index() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const registerAccount = async () => {
    if (!username) {
      Alert.alert("Field Empty!", "Please enter your username");
      return;
    } else if (!email) {
      Alert.alert("Field Empty!", "Please enter your email");
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

      Register(username, email, password).then((response) => {
        STATUS_CODE = response.status;

        response
          .json()
          .then((responseJson) => {
            if (
              STATUS_CODE === 400 &&
              responseJson.code === "registration-error-username-exists"
            ) {
              setLoading(false);
              Alert.alert(
                "Already Exist!",
                "This username is already taken by other user please try another one"
              );

              return;
            }
            if (
              STATUS_CODE === 400 &&
              responseJson.code === "registration-error-email-exists"
            ) {
              setLoading(false);
              Alert.alert(
                "Already Exist!",
                "This email is already taken by other user please try another one"
              );
              return;
            }

            Login(username, password).then((response) => {
              STATUS_CODE = response.status;

              response
                .json()
                .then((responseJson) => {
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
      <Header
        leftImage={appStyle.BACK_ICON_IMAGE}
        onLeftPress={() => router.back()}
      />
      <ScrollView>
        <View className=" items-center justify-center bg-white">
          <Text className=" text-4xl font-medium mb-1"> Sign Up </Text>
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
              placeholder="Email"
              placeholderTextColor={"gray"}
              value={email}
              onChange={(event) => setEmail(event.nativeEvent.text)}
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

      <ButtonOne onPress={() => registerAccount()} text="Sign Up" />
    </SafeAreaView>
  );
}
