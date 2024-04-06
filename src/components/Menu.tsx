import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  Pressable,
} from "react-native";
import * as Animatable from "react-native-animatable";
import appStyle from "../constants/Colors";
import Header from "./Header";
import { router } from "expo-router";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../src/redux/store";
import { logoutUser } from "../redux/Slice/AuthSlice";
import { useColorScheme } from "nativewind";
import { deleteUserNotificationToken, getAllOrders } from "../api/helper";
import LottieView from "lottie-react-native";

interface MenuProps {
  handleClick?: () => void;
  UserMenu: () => void;
}

interface User {
  id: string;
  username: string;
  userImage: string;
  token: string;
}

export default function Menu({ handleClick, UserMenu }: MenuProps) {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  const [isUserAuthAvailable, setIsUserAuthAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);
  const [currentUserInfo, setCurrentUserInfo] = useState<User | null>(null);
  const isUserAvailable = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isUserAvailable.isAuthenticated) {
      setCurrentUserInfo(isUserAvailable.user);
      setIsUserAuthAvailable(true);
      getOrders();
    } else {
      setIsUserAuthAvailable(false);
    }
  }, [isUserAvailable]);

  const getOrders = async () => {
    getAllOrders(isUserAvailable.user["id"])
      .then((response) => response.json())
      .then((responseJson) => {
        setOrdersCount(responseJson.length);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBackgroundPress = (event: any) => {
    if (event.target === event.currentTarget) {
      UserMenu();
    }
  };

  const Logout = () => {
    setLoading(true);
    dispatch(logoutUser());
    router.push("/(tabs)/home");
    handleClick();

    deleteUserNotificationToken(isUserAvailable.user["id"])
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
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
    <SafeAreaView className="flex-1">
      <Pressable onPress={handleBackgroundPress}>
        <Animatable.View
          duration={600}
          animation="fadeInLeftBig"
          className="bg-white dark:bg-black  h-[100%] w-[80%]"
        >
          <ScrollView>
            <Header
              leftImage={appStyle.MENU_CLOSE_ICON}
              onLeftPress={UserMenu}
            />

            {isUserAuthAvailable ? (
              <View className="flex-row mt-5 p-5 pt-0">
                <View className="w-[25%] justify-center items-start">
                  <Image
                    className="w-[50px] h-[50px] rounded-full"
                    source={{ uri: currentUserInfo.userImage }}
                  />
                </View>
                <View className="w-[45%] justify-center items-start">
                  <Text className="text-[20px] dark:text-white font-semibold">
                    {currentUserInfo.username}
                  </Text>
                  <View className="flex-row">
                    <Text className="text-[13px] text-gray-300 ">
                      Verified Profile
                    </Text>
                    <Image
                      className="w-[18px] h-[18px] rounded-full ml-1"
                      source={appStyle.VERIFIED_ICON}
                    />
                  </View>
                </View>
                <View className="w-[30%] justify-center items-end">
                  <View className="bg-gray-100 p-2 rounded-lg">
                    <Text className="text-[13px] font-medium text-gray-400">
                      {ordersCount} Orders
                    </Text>
                  </View>
                </View>
              </View>
            ) : null}

            <View className="mt-5">
              <View className="flex-row p-4 pb-0 items-center">
                <View className="w-[75%] flex-row items-center">
                  <Image
                    className="w-[22px] h-[22px] mr-4 "
                    source={
                      colorScheme === "dark"
                        ? appStyle.MENU_ICON_1_WHITE
                        : appStyle.MENU_ICON_1
                    }
                  />
                  <Text className="text-[18px] dark:text-white ">
                    Dark Mode
                  </Text>
                </View>
                <View className="w-[25%] items-end">
                  <Switch
                    value={colorScheme == "dark"}
                    onValueChange={toggleColorScheme}
                    trackColor={{ false: "#dddddd", true: "#33C458" }}
                    thumbColor={appStyle.Colors.whiteColor}
                  />
                </View>
              </View>
              {isUserAuthAvailable ? (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/AccountInformation/");
                      handleClick();
                    }}
                    className="flex-row p-4 pt-5 items-center"
                  >
                    <Image
                      className="w-[22px] h-[22px] mr-4 "
                      source={
                        colorScheme === "dark"
                          ? appStyle.MENU_ICON_2_WHITE
                          : appStyle.MENU_ICON_2
                      }
                    />
                    <Text className="text-[18px] dark:text-white ">
                      Account Information
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      router.push({
                        pathname: "/UpdatePassword/",
                        params: {
                          id: currentUserInfo.id,
                          token: currentUserInfo.token,
                        },
                      });

                      handleClick();
                    }}
                    className="flex-row p-4 items-center"
                  >
                    <Image
                      className="w-[22px] h-[22px] mr-4 "
                      source={
                        colorScheme === "dark"
                          ? appStyle.MENU_ICON_3_WHITE
                          : appStyle.MENU_ICON_3
                      }
                    />
                    <Text className="text-[18px] dark:text-white">
                      Password
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      router.push("/(tabs)/orders");
                      handleClick();
                    }}
                    className="flex-row p-4 items-center"
                  >
                    <Image
                      className="w-[22px] h-[22px] mr-4"
                      source={
                        colorScheme === "dark"
                          ? appStyle.MENU_ICON_4_WHITE
                          : appStyle.MENU_ICON_4
                      }
                    />
                    <Text className="text-[18px] dark:text-white">
                      My order
                    </Text>
                  </TouchableOpacity>
                </>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  router.push("/(tabs)/wishlist");
                  handleClick();
                }}
                className="flex-row p-4 items-center"
              >
                <Image
                  className="w-[22px] h-[22px] mr-4 "
                  source={
                    colorScheme === "dark"
                      ? appStyle.MENU_ICON_5_WHITE
                      : appStyle.MENU_ICON_5
                  }
                />
                <Text className="text-[18px] dark:text-white">My wishlist</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row p-4 items-center">
                <Image
                  className="w-[22px] h-[22px] mr-4"
                  source={
                    colorScheme === "dark"
                      ? appStyle.MENU_ICON_6_WHITE
                      : appStyle.MENU_ICON_6
                  }
                />
                <Text className="text-[18px] dark:text-white">Settings</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {isUserAuthAvailable ? (
            <TouchableOpacity
              onPress={() => {
                Logout();
              }}
              className="flex-row p-4 mb-10"
            >
              <Image
                className="w-[25px] h-[25px] mr-4 mt-1"
                source={appStyle.MENU_ICON_7}
              />
              <Text className="text-[20px] text-[#FF5757]">Logout</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                router.push("/Login/");
                handleClick();
              }}
              className="flex-row p-4 mb-10"
            >
              <Image
                className="w-[20px] h-[20px] mr-4 mt-1"
                source={
                  colorScheme === "dark"
                    ? appStyle.MENU_ICON_8_WHITE
                    : appStyle.MENU_ICON_8
                }
              />
              <Text className="text-[20px] dark:text-white">Login</Text>
            </TouchableOpacity>
          )}
        </Animatable.View>
      </Pressable>
    </SafeAreaView>
  );
}
