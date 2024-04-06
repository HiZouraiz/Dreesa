import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import appStyle from "../../src/constants/Colors";
import Header from "../../src/components/Header";
import ButtonOne from "../../src/components/ButtonOne";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { forgotPassword, validateVerificationCode } from "../../src/api/helper";

export default function index() {
  const paramItem = useLocalSearchParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const verifyCode = () => {
    if (!code) {
      Alert.alert("Empty!", "Please enter your verification code");
      return;
    }
    setLoading(true);

    let STATUS_CODE: any;

    validateVerificationCode(paramItem["email"], code).then((response) => {
      STATUS_CODE = response.status;
      response.json().then((responseJson) => {
        if (STATUS_CODE === 500) {
          setLoading(false);
          Alert.alert("Invalid!", responseJson.message);
        } else if (STATUS_CODE === 200) {
          setLoading(false);

          router.push({
            pathname: "/NewPassword/",
            params: { email: paramItem["email"], code: code },
          });
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

  const sendLink = async () => {
    setLoading(true);

    let STATUS_CODE: any;

    forgotPassword(paramItem["email"]).then((response) => {
      STATUS_CODE = response.status;
      response.json().then((responseJson) => {
        if (STATUS_CODE === 200) {
          setLoading(false);
          Alert.alert(
            "Success!",
            "A password reset email has been sent to your email address"
          );
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
    <SafeAreaView className="flex-1 bg-white">
      <Header
        leftImage={appStyle.BACK_ICON_IMAGE}
        onLeftPress={() => router.back()}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center justify-center bg-white">
          <Text className="text-[24px] font-semibold mb-1">
            Verification Code
          </Text>
        </View>

        <View className="items-center justify-center">
          <Image
            resizeMode="contain"
            className="w-[350px] h-[350px]"
            source={require("../../src/assets/images/icons/verification.png")}
          />
        </View>

        <View style={{ padding: 20, paddingTop: 0 }}>
          <View
            className={`flex-row  px-4 bg-white item-center rounded-2xl border-b border-[${appStyle.Colors.lightGrayColor}] border-opacity-100 pb-3`}
          >
            <TextInput
              className="flex-1 text-neutral-700 text-[18px] pr-5"
              placeholder="Verification code"
              placeholderTextColor={"gray"}
              value={code}
              onChange={(event) => setCode(event.nativeEvent.text)}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => sendLink()}
        className="p-8 mt-3 items-center justify-center"
      >
        <Text className="text-[15px] text-gray-400 text-center">
          Resend confirmation code.
        </Text>
      </TouchableOpacity>

      <ButtonOne text="Confirm Code" onPress={() => verifyCode()} />
    </SafeAreaView>
  );
}
