import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import Modal from "react-native-modal";

import { SafeAreaView } from "react-native-safe-area-context";
import appStyle from "../../src/constants/Colors";
import { router } from "expo-router";
import Header from "../../src/components/Header";
import Menu from "../../src/components/Menu";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";

import { getAllOrders } from "../../src/api/helper";
import LottieView from "lottie-react-native";

const Orders = () => {
  const [UserMenu, setUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const isUserAvailable = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    checkUserAuth();
  }, [isUserAvailable]);

  const checkUserAuth = () => {
    if (!isUserAvailable.isAuthenticated) {
      Alert.alert(
        "Login Required!",
        "Are you sure you want to proceed?",
        [
          {
            text: "Leter",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Login Now",
            onPress: () => router.push("/Login/"),
          },
        ],
        { cancelable: false }
      );
    } else {
      getOrders();
    }
  };

  const getOrders = async () => {
    setLoading(true);

    getAllOrders(isUserAvailable.user["id"])
      .then((response) => response.json())
      .then((responseJson) => {
        setUserOrders(responseJson);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const move = () => {
    setUserMenu(false);
  };

  const renderOrders = ({ item }: { item: any }) => (
    <View className="flex-row w-[95%] bg-gray-100 rounded-[20px] m-2">
      <View className="justify-center m-5">
        <View className="flex-row">
          <View className="w-[30%] items-start">
            <Text
              numberOfLines={2}
              className={`text-[18px] font-semibold`}
              style={{ color: appStyle.Colors.primaryColor }}
            >
              #{item.id}
            </Text>
          </View>
          <View className="w-[70%] items-end">
            <View
              className={`items-center rounded-lg p-1`}
              style={{ backgroundColor: appStyle.Colors.primaryColor }}
            >
              <Text className={`text-white text-[14px]`}>
                {item.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <Text numberOfLines={1} className="text-gray-400 text-[15px] mb-4">
          {item.line_items.length} items
        </Text>

        {item.line_items.map((product: any) => (
          <View key={product.id} className="mt-1 mb-1">
            <Text className="text-gray-500 text-md">• {product.name}</Text>
          </View>
        ))}

        <Text
          numberOfLines={2}
          className={`text-[22px] font-semibold mt-2 text-black`}
        >
          {item.currency_symbol} {item.total}
        </Text>
      </View>
    </View>
  );

  const onRefresh = () => {
    setLoading(true);
    setRefreshLoading(true);
    getOrders();
    setTimeout(() => {
      setLoading(false);
      setRefreshLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        title="Orders"
        leftImage={appStyle.MENU_OPEN_ICON}
        onLeftPress={() => setUserMenu(true)}
        rightImage={appStyle.CART_ICON}
        onRightPress={() => router.push("/Cart/")}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="mt-5">
            {[...Array(10)].map((_, index) => (
              <View
                key={index}
                className={
                  "w-[90%] self-center rounded-lg bg-gray-100 h-[130px] mb-5"
                }
              >
                <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
              </View>
            ))}
          </View>
        ) : (
          <>
            {userOrders.length < 1 ? (
              <View className="justify-center flex-1 items-center bg-white h-[600]">
                <LottieView
                  style={{
                    width: 300,
                    height: 300,
                  }}
                  source={appStyle.EMPTY_CART_FILE}
                  loop={true}
                  autoPlay
                />
              </View>
            ) : (
              <View className="flex-1 bg-white p-3">
                <FlatList
                  data={userOrders}
                  keyExtractor={(item) => `${item.id || Math.random()}`}
                  renderItem={renderOrders}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={false}
                  refreshing={loading}
                  onRefresh={onRefresh}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>

      <Modal
        isVisible={UserMenu}
        animationIn={"slideInLeft"}
        animationOut={"slideOutLeft"}
        backdropColor={"rgba(0,0,0,0.7)"}
        style={{ margin: 0 }}
        animationInTiming={100}
        animationOutTiming={1200}
        backdropTransitionInTiming={100}
        backdropTransitionOutTiming={1500}
      >
        <Menu UserMenu={() => setUserMenu(false)} handleClick={() => move()} />
      </Modal>
    </SafeAreaView>
  );
};

export default Orders;
