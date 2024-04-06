import { router, useLocalSearchParams } from "expo-router";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ButtonOne from "../../src/components/ButtonOne";
import { AirbnbRating } from "react-native-ratings";
import { createCustomerReview } from "../../src/api/helper";
import LottieView from "lottie-react-native";

const WriteReview = () => {
  const paramItem = useLocalSearchParams();

  const [myRating, setMyRating] = useState(0);

  const [review, setReview] = useState("");

  const [loading, setLoading] = useState(false);

  const ratingSubmit = (rating: any) => {
    setMyRating(rating);
  };

  const writeReview = () => {
    if (myRating < 1) {
      Alert.alert("Required!", "Please select your rating");
      return;
    } else if (!review) {
      Alert.alert("Required!", "Please write your review");
      return;
    } else {
      setLoading(true);

      let STATUS_CODE: any;

      createCustomerReview(
        paramItem["product_id"],
        review,
        myRating,
        paramItem["user_name"],
        paramItem["user_email"]
      ).then((response) => {
        STATUS_CODE = response.status;

        response
          .json()
          .then((responseJson) => {
            if (STATUS_CODE === 201 || STATUS_CODE === 200) {
              setLoading(false);
              router.back();
            } else {
              setLoading(false);
              Alert.alert(
                "Sorry!",
                "Something went wrong please try again in a while."
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <Header
          leftImage={appStyle.BACK_ICON_IMAGE}
          onLeftPress={() => router.back()}
          title={"Add Review"}
        />

        <AirbnbRating
          {...{
            defaultRating: myRating,

            ratingCount: 5,

            imageSize: 30,

            onFinishRating: ratingSubmit,
          }}
        />

        <View className="p-5 mt-8">
          <Text className="text-[20px] font-semibold mb-3 ml-2 mt-5">
            How was your experience ?
          </Text>
          <View className="flex-row items-center bg-gray-100 rounded-lg p-3">
            <TextInput
              className="flex-1 w-24 h-[150px] text-[16px] pl-3"
              placeholder="Describe your experience?"
              placeholderTextColor="gray"
              style={{ textAlignVertical: "top", padding: 10 }}
              multiline
              numberOfLines={6}
              value={review}
              onChange={(event) => setReview(event.nativeEvent.text)}
            />
          </View>
        </View>
      </ScrollView>
      <ButtonOne onPress={() => writeReview()} text="SUBMIT REVIEW" />
    </SafeAreaView>
  );
};

export default WriteReview;
