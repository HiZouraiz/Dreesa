import { router, useLocalSearchParams } from "expo-router";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonOne from "../../src/components/ButtonOne";
import {
  getAllShippingZones,
  getUserProfile,
  updateShippingAddress,
} from "../../src/api/helper";

import { Picker } from "@react-native-picker/picker";

const AddAddress = () => {
  const paramItem = useLocalSearchParams();

  const [shippingZone, setShippingZone] = useState([]);

  const [country, setCountry] = useState("");

  const [city, setCity] = useState("");

  const [countryState, setCountryState] = useState("");

  const [postalCode, setPostalCode] = useState("");

  const [phoneNumber, setPhoneNumber] = useState("");

  const [address, setAddress] = useState("");

  const [shippingAddress, setShippingAddress] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(shippingAddress);
    shippingZones();
  }, []);

  const shippingZones = async () => {
    setLoading(true);

    getAllShippingZones()
      .then((response) => response.json())
      .then((responseJson) => {
        const zonesData = responseJson.map((zone: { name: any }) => zone.name);
        const shipping_zones = zonesData.filter(
          (zone: any, index: number) =>
            zone !== "Emplacements non couverts par vos autres zones"
        );
        setShippingZone(["Select country", ...shipping_zones]);
        getAddresses();
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const getAddresses = async () => {
    setLoading(true);

    getUserProfile(paramItem["user_id"])
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.shipping.country) {
          setShippingAddress([responseJson.shipping]);
          setCountry(responseJson.shipping.country);
          setAddress(responseJson.shipping.address_1);
          setPhoneNumber(responseJson.shipping.phone);
          setCity(responseJson.shipping.city);
          setCountryState(responseJson.shipping.state);
          setPostalCode(responseJson.shipping.postcode);
          setLoading(false);
        } else {
          setShippingAddress([]);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  const updateAddress = async () => {
    if (country === "Select country" || country === "") {
      Alert.alert("Empty!", "Please select your country");
      return;
    } else if (!countryState) {
      Alert.alert("Empty!", "Please enter your state");
      return;
    } else if (!city) {
      Alert.alert("Empty!", "Please enter your city");
      return;
    } else if (!postalCode) {
      Alert.alert("Empty!", "Please enter your postal code");
      return;
    } else if (!phoneNumber) {
      Alert.alert("Empty!", "Please enter your phone number");
      return;
    } else if (!address) {
      Alert.alert("Empty!", "Please enter your phone address");
      return;
    } else {
      setLoading(true);

      const addressData = {
        first_name: paramItem["user_name"],
        last_name: paramItem["user_name"],
        company: "",
        address_1: address,
        address_2: address,
        city: city,
        state: countryState,
        postcode: postalCode,
        country: country,
        phone: phoneNumber,
        email: paramItem["user_email"],
      };

      let STATUS_CODE: any;

      updateShippingAddress(paramItem["user_id"], addressData).then(
        (response) => {
          STATUS_CODE = response.status;

          response
            .json()
            .then((responseJson) => {
              if (STATUS_CODE === 200) {
                setLoading(false);
                router.back();
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
        }
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          leftImage={appStyle.BACK_ICON_IMAGE}
          onLeftPress={() => router.back()}
          title={"Address"}
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
                Country
              </Text>
              {Platform.OS === "ios" ? (
                <View className="mb-20 mt-[-10%]">
                  <Picker
                    selectedValue={country}
                    style={{ height: 100, width: "100%" }}
                    onValueChange={(itemValue, itemIndex) =>
                      setCountry(itemValue)
                    }
                  >
                    {shippingZone.map((zone, index) => (
                      <Picker.Item key={index} label={zone} value={zone} />
                    ))}
                  </Picker>
                </View>
              ) : (
                <View className="items-center bg-gray-100 rounded-lg pb-1 pt-0">
                  <Picker
                    selectedValue={country}
                    style={{
                      height: 50,
                      width: "100%",
                    }}
                    onValueChange={(itemValue, itemIndex) =>
                      setCountry(itemValue)
                    }
                  >
                    {shippingZone.map((zone, index) => (
                      <Picker.Item key={index} label={zone} value={zone} />
                    ))}
                  </Picker>
                </View>
              )}
            </View>

            <View className="p-5 pb-0 pt-0 ">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                State
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="State"
                  placeholderTextColor="gray"
                  value={countryState}
                  onChange={(event) => setCountryState(event.nativeEvent.text)}
                />
              </View>
            </View>

            <View className="p-5 pb-0 pt-0 ">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                City
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="City"
                  placeholderTextColor="gray"
                  value={city}
                  onChange={(event) => setCity(event.nativeEvent.text)}
                />
              </View>
            </View>

            <View className="p-5 pb-0 pt-0 ">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                Postal Code
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="Postal Code"
                  placeholderTextColor="gray"
                  value={postalCode}
                  onChange={(event) => setPostalCode(event.nativeEvent.text)}
                />
              </View>
            </View>

            <View className="p-5 pb-0 pt-0 ">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                Phone Number
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="+XX XX XX XX XX"
                  placeholderTextColor="gray"
                  value={phoneNumber}
                  keyboardType="phone-pad"
                  maxLength={11}
                  onChange={(event) => setPhoneNumber(event.nativeEvent.text)}
                />
              </View>
            </View>

            <View className="p-5 pb-0 pt-0 mb-5">
              <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
                Address
              </Text>
              <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
                <TextInput
                  className="flex-1 w-24 text-[16px] pl-3"
                  placeholder="Address"
                  placeholderTextColor="gray"
                  value={address}
                  onChange={(event) => setAddress(event.nativeEvent.text)}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>
      {loading ? null : (
        <ButtonOne onPress={() => updateAddress()} text={"Save Address"} />
      )}
    </SafeAreaView>
  );
};

export default AddAddress;
