import { router } from "expo-router";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";
import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getUserProfile, updateUserProfile } from "../../src/api/helper";

import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";
import ButtonOne from "../../src/components/ButtonOne";

const index = () => {
  const isUserAvailable = useSelector((state: RootState) => state.auth);

  const [username, setUsername] = useState("");

  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isUserAvailable.isAuthenticated) {
      setLoading(true);
      getUserProfile(isUserAvailable.user["id"])
        .then((response) => response.json())
        .then((responseJson) => {
          setUsername(responseJson.username);
          setFirstName(responseJson.first_name);
          setLastName(responseJson.last_name);
          setEmail(responseJson.email);

          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, [isUserAvailable]);

  const updateProfile = async () => {
    if (!username) {
      Alert.alert("Empty!", "Please enter your username");
      return;
    } else if (!firstName) {
      Alert.alert("Empty!", "Please enter your first name");
      return;
    } else if (!lastName) {
      Alert.alert("Empty!", "Please enter your last name");
      return;
    } else if (!email) {
      Alert.alert("Empty!", "Please enter your email");
      return;
    } else {
      setLoading(true);

      let STATUS_CODE: any;

      updateUserProfile(
        isUserAvailable.user["id"],
        firstName,
        lastName,
        email
      ).then((response) => {
        STATUS_CODE = response.status;

        response
          .json()
          .then((responseJson) => {
            if (STATUS_CODE === 200) {
              setLoading(false);
              Alert.alert("Confirm!", "Your account has been updated");
            } else {
              setLoading(false);
              Alert.alert(
                "Sorry!",
                "Something went wrong please again in a while"
              );
            }
          })

          .catch((error) => {
            setLoading(false);
            console.log(error);
          });
      });
    }
  };

  const handleBackPress = useMemo(() => {
    return () => {
      router.back();
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          leftImage={appStyle.BACK_ICON_IMAGE}
          onLeftPress={handleBackPress}
          title={"Account Information"}
        />

        {loading ? (
          <View>
            {[...Array(10)].map((_, index) => (
              <View
                key={index}
                className={
                  "w-[90%] self-center rounded-lg bg-gray-100 h-20 mb-5"
                }
              >
                <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
              </View>
            ))}
          </View>
        ) : (
          <>
            <View className="p-5 pb-0 pt-0 ">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                Username
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="State"
                  placeholderTextColor="gray"
                  value={username}
                  onChange={(event) => setUsername(event.nativeEvent.text)}
                  editable={false}
                />
              </View>
            </View>

            <View className="p-5 pb-0 pt-0 ">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                First name
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="First name"
                  placeholderTextColor="gray"
                  value={firstName}
                  onChange={(event) => setFirstName(event.nativeEvent.text)}
                />
              </View>
            </View>

            <View className="p-5 pb-0 pt-0 ">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                Last name
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="Last name"
                  placeholderTextColor="gray"
                  value={lastName}
                  onChange={(event) => setLastName(event.nativeEvent.text)}
                />
              </View>
            </View>

            <View className="p-5 pb-0 pt-0 ">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                Email
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="City"
                  placeholderTextColor="gray"
                  value={email}
                  onChange={(event) => setEmail(event.nativeEvent.text)}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
      {loading ? null : (
        <ButtonOne onPress={() => updateProfile()} text={"Update Profile"} />
      )}
    </SafeAreaView>
  );
};

export default index;
