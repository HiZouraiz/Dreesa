import { router, useFocusEffect } from "expo-router";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStripe } from "@stripe/stripe-react-native";
import { Checkbox } from "expo-checkbox";
import ButtonOne from "../../src/components/ButtonOne";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../src/redux/store";
import {
  addProductToCart,
  deleteCartItem,
  emptyCart,
  removeProductToCart,
} from "../../src/redux/Slice/CartSlice";
import LottieView from "lottie-react-native";
import {
  createNewOrder,
  fetchShippingMethods,
  getAllShippingZones,
  getUserProfile,
  stripePaymentInit,
} from "../../src/api/helper";

const Cart = () => {
  const cartAvailableProducts = useSelector((state: RootState) => state.cart);

  const isUserAvailable = useSelector((state: RootState) => state.auth);

  const [shippingMethods, setShippingMethods] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);

  const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);

  const [shippingAddress, setShippingAddress] = useState([]);

  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const [loading, setLoading] = useState(false);

  const [orderLoader, setOrderLoader] = useState(false);

  const [refreshLoading, setRefreshLoading] = useState(false);

  const dispatch = useDispatch();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  useFocusEffect(
    React.useCallback(() => {
      if (isUserAvailable.isAuthenticated) {
        getAddresses();
      }
    }, [router])
  );

  const handleAddressSelect = (id: any) => {
    setSelectedAddress(id);
  };

  const getAddresses = async () => {
    setLoading(true);

    getUserProfile(isUserAvailable.user["id"])
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.shipping.country) {
          setShippingAddress([responseJson.shipping]);
          shippingZones(responseJson.shipping.country);
        } else {
          setShippingAddress([]);
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const shippingZones = async (country: any) => {
    setLoading(true);

    getAllShippingZones()
      .then((response) => response.json())
      .then((responseJson) => {
        const zone = responseJson.find(
          (zone: any) => zone.name.toUpperCase() === country.toUpperCase()
        );

        if (zone) {
          const zoneId = zone.id;
          fetchShippingMethods(zoneId)
            .then((response) => response.json())
            .then((responseJson) => {
              const methodsWithCosts = responseJson
                .filter((method: any) => method.settings.cost)
                .map((method: any) => ({
                  id: method.id,
                  title: method.title,
                  cost: method.settings.cost.value,
                }));
              setShippingMethods(methodsWithCosts);
            })
            .catch((error) => {
              setLoading(false);
              console.log(error);
            });
        } else {
          setShippingMethods([]);
          console.log(
            "No shipping zone found for the provided country:",
            country
          );
        }

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const checkUserAuth = () => {
    if (isUserAvailable.isAuthenticated) {
      const OBJ = {
        user_id: isUserAvailable.user.id,
        user_email: isUserAvailable.user.user_email,
        user_name: isUserAvailable.user.username,
      };
      router.push({ pathname: "/AddAddress/", params: OBJ });
    } else {
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
    }
  };

  const fetchPaymentIntentClientSecret = async () => {
    if (isUserAvailable.isAuthenticated) {
      if (!selectedAddress) {
        Alert.alert("Address Info", "Please select your delivery address");
        return;
      } else if (!selectedShippingMethod) {
        Alert.alert("Shipping Method", "Please select your shipping method");
        return;
      }

      setOrderLoader(true);
      const TOTAL_AMOUNT = calculateTotal();
      stripePaymentInit(TOTAL_AMOUNT)
        .then((response) => response.json())
        .then((responseJson) => {
          setOrderLoader(false);
          checkout(responseJson.key);
        })
        .catch((error) => {
          setOrderLoader(false);
          console.log(error);
        });
    } else {
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
    }
  };

  const checkout = async (KEY: any) => {
    const initResponse = await initPaymentSheet({
      merchantDisplayName: "Dressa",
      paymentIntentClientSecret: KEY,
    });

    if (initResponse.error) {
      console.log(initResponse.error);
      Alert.alert("Sorry", "Something went wrong please try again in a while");
      return;
    }

    const checkPayment = await presentPaymentSheet();

    if (checkPayment.error) {
      return;
    }

    placeOrder();
  };

  const placeOrder = () => {
    setOrderLoader(true);

    const billing = {
      first_name: isUserAvailable.user["username"],
      last_name: isUserAvailable.user["username"],
      address_1: selectedAddress.address_1,
      address_2: selectedAddress.address_2,
      city: selectedAddress.city,
      state: selectedAddress.state,
      postcode: selectedAddress.postcode,
      country: selectedAddress.country,
      email: isUserAvailable.user["user_email"],
      phone: selectedAddress.phone,
    };

    const shipping = selectedAddress;

    const line_items: { product_id: any; variation_id: any; quantity: any }[] =
      [];

    cartAvailableProducts.map((item) => {
      line_items.push({
        product_id: item.id,
        variation_id: item.variation_id,
        quantity: item.qty,
      });
    });

    const shipping_lines = [
      {
        method_id: selectedShippingMethod.id,
        method_title: selectedShippingMethod.title,
        total: selectedShippingMethod.cost,
      },
    ];

    let STATUS_CODE: any;

    createNewOrder(
      isUserAvailable.user["id"],
      billing,
      shipping,
      line_items,
      shipping_lines
    ).then((response) => {
      STATUS_CODE = response.status;

      response
        .json()
        .then((responseJson) => {
          if (STATUS_CODE === 201) {
            dispatch(emptyCart({}));
            router.push("/Checkout/");
            setOrderLoader(false);
          }
        })

        .catch((error) => {
          setOrderLoader(false);
          console.log(error);
        });
    });
  };

  const handleIncrement = (item: any) => {
    if (item.qty === item.stock_quantity) {
      return;
    }
    dispatch(addProductToCart(item));
  };

  const handleDecrement = (item: any) => {
    if (item.qty === 1) {
      return;
    }
    dispatch(removeProductToCart(item));
  };

  const handleShippingMethodSelect = (method: any) => {
    setSelectedShippingMethod(method);
    setDeliveryCharge(method.cost);
  };

  const calculateSubTotal = () => {
    let subTotal = 0;
    cartAvailableProducts.forEach((item) => {
      subTotal += item.price * item.qty;
    });
    return subTotal;
  };

  const calculateTotal = () => {
    const shippingCost = selectedShippingMethod
      ? Number(selectedShippingMethod.cost)
      : 0;
    return calculateSubTotal() + shippingCost;
  };

  const renderProducts = ({ item }: { item: any }) => {
    return (
      <View
        className="flex-row w-[95%] bg-white rounded-[20px] m-2"
        style={{
          shadowColor: "rgba(0,0,0,0.7)",
          elevation: 6,
        }}
      >
        <View className="w-[35%]">
          <Image
            className="w-[90px] h-[110px] m-2 rounded-[20px]"
            source={{ uri: item.image }}
          />
        </View>
        <View className="w-[60%] justify-center">
          <Text
            numberOfLines={2}
            className="text-black text-[16px] font-semibold"
          >
            {item.name}
          </Text>
          <Text numberOfLines={1} className="text-gray-400 text-[14px] mt-2 ">
            ${item.price}
          </Text>

          <View className="flex-row items-center mt-2">
            <View className="w-[80%] flex-row items-center">
              <TouchableOpacity onPress={() => handleDecrement(item)}>
                <Image
                  resizeMode="contain"
                  className="w-[22px] h-[22px]"
                  source={appStyle.DECREMENT_ICON}
                />
              </TouchableOpacity>
              <Text className="text-[16px] text-black font-semibold mr-3 ml-3">
                {item.qty}
              </Text>
              <TouchableOpacity onPress={() => handleIncrement(item)}>
                <Image
                  resizeMode="contain"
                  className="w-[22px] h-[22px]"
                  source={appStyle.INCREMENT_ICON}
                />
              </TouchableOpacity>
            </View>
            <View className="w-[20%] items-end">
              <TouchableOpacity
                onPress={() => dispatch(deleteCartItem(item.id))}
              >
                <Image
                  resizeMode="contain"
                  className="w-[26px] h-[26px]"
                  source={appStyle.DELETE_ICON}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderAddress = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => handleAddressSelect(item)}
        className="flex-row  bg-white mt-2"
      >
        <View className="w-[20%]">
          <Image
            resizeMode="contain"
            className="w-[70px] h-[70px]  rounded-[20px]"
            source={appStyle.ADDRESS_THUMBNAIL}
          />
        </View>
        <View className="w-[70%] justify-center">
          <Text className="text-gray-400 text-[17px] ml-3">
            {`${item.address_1}, ${item.state}, ${item.city}, ${item.postcode}, ${item.country}`}
          </Text>
        </View>
        <View className="w-[10%] justify-center">
          <Checkbox
            value={selectedAddress === item}
            className="rounded-full w-6 h-6 border-[0.5px] border-[#cccccc]"
            onChange={() => {}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderShippingMethod = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => handleShippingMethodSelect(item)}
        className="flex-row  bg-white"
      >
        <View style={{ width: "90%" }}>
          <Text className="text-gray-400 text-[17px]">{item.title}</Text>
        </View>
        <View className="w-[10%] justify-center">
          <Checkbox
            value={selectedShippingMethod === item}
            className="rounded-full w-6 h-6 border-[0.5px] border-[#cccccc]"
            onChange={() => handleShippingMethodSelect(item)}
          />
        </View>
      </TouchableOpacity>
    );
  };

  if (orderLoader) {
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

  const onRefresh = () => {
    setLoading(true);
    setRefreshLoading(true);
    if (isUserAvailable.isAuthenticated) {
      getAddresses();
    }
    setTimeout(() => {
      setLoading(false);
      setRefreshLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        leftImage={appStyle.BACK_ICON_IMAGE}
        onLeftPress={() => router.back()}
        title={"Cart"}
      />
      {cartAvailableProducts.length < 1 ? (
        <View className="justify-center flex-1 items-center bg-white">
          <LottieView
            style={{
              width: "80%",
              height: "80%",
              marginTop: "-20%",
            }}
            source={appStyle.EMPTY_CART_FILE}
            loop={true}
            autoPlay
          />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshLoading} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View className="p-5 pt-0">
            <FlatList
              data={cartAvailableProducts}
              keyExtractor={(item) => `${item.id}`}
              renderItem={renderProducts}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <View className="flex-row mt-5 p-5 pt-0">
            <View className="w-[75%] justify-center items-start">
              <Text className="text-[20px] font-semibold">
                Delivery Address
              </Text>
            </View>
            <View className="w-[25%] justify-center items-end">
              <TouchableOpacity onPress={() => checkUserAuth()}>
                <Image
                  resizeMode="contain"
                  className="w-[22px] h-[22px]"
                  source={appStyle.ARROW_RIGHT_ICON}
                />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View
              className={"w-[90%] self-center rounded-lg bg-gray-100 h-20 mb-5"}
            >
              <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
            </View>
          ) : (
            <>
              {shippingAddress.length > 0 ? (
                <View className="p-5 pt-0">
                  <FlatList
                    data={shippingAddress}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderAddress}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              ) : (
                <View className="justify-center items-center mt-3 mb-3">
                  <TouchableOpacity onPress={() => checkUserAuth()}>
                    <Text
                      style={{ color: appStyle.Colors.primaryColor }}
                      className="text-[18px] font-bold"
                    >
                      Add Delivery Address +
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          <View className="flex-row mt-5 p-5 pt-0">
            <View className="w-[75%] justify-center items-start">
              <Text className="text-[20px] font-semibold">
                Shipping Methods
              </Text>
            </View>
            <View className="w-[25%] justify-center items-end"></View>
          </View>

          {loading ? (
            <View
              className={"w-[90%] self-center rounded-lg bg-gray-100 h-20 mb-5"}
            >
              <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
            </View>
          ) : (
            <>
              {shippingMethods.length > 0 ? (
                <View className="p-5 pt-0">
                  <FlatList
                    data={shippingMethods}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderShippingMethod}
                    scrollEnabled={false}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              ) : (
                <View className="justify-center items-center mt-3 mb-3">
                  <Text
                    style={{ color: appStyle.Colors.primaryColor }}
                    className="text-[18px] font-bold"
                  >
                    No shipping methods available
                  </Text>
                </View>
              )}
            </>
          )}

          <View className="flex-row mt-2  p-5 pt-0">
            <Text className="text-[20px] font-semibold">Order Info</Text>
          </View>

          {loading ? (
            <View
              className={"w-[90%] self-center rounded-lg bg-gray-100 h-28 mb-5"}
            >
              <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
            </View>
          ) : (
            <>
              <View className="flex-row  p-5 pt-0 pb-2">
                <View className="w-[50%] justify-center items-start">
                  <Text className="text-[18px] text-gray-400 ">Sub total</Text>
                </View>
                <View className="w-[50%] justify-center items-end">
                  <TouchableOpacity>
                    <Text className="text-[18px] font-semibold">
                      ${calculateSubTotal()}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row  p-5 pt-0 pb-2">
                <View className="w-[50%] justify-center items-start">
                  <Text className="text-[18px] text-gray-400 ">
                    Delivery Charge
                  </Text>
                </View>
                <View className="w-[50%] justify-center items-end">
                  <TouchableOpacity>
                    <Text className="text-[18px] font-semibold">
                      ${deliveryCharge}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row  p-5 pt-0">
                <View className="w-[50%] justify-center items-start">
                  <Text className="text-[18px] text-gray-400 ">Total</Text>
                </View>
                <View className="w-[50%] justify-center items-end">
                  <TouchableOpacity>
                    <Text className="text-[18px] font-semibold">
                      ${calculateTotal().toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {cartAvailableProducts.length < 1 ? null : (
        <ButtonOne
          onPress={() => fetchPaymentIntentClientSecret()}
          text="Checkout"
        />
      )}
    </SafeAreaView>
  );
};

export default Cart;
