import { router, useLocalSearchParams } from "expo-router";

import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProductReviewByID } from "../../src/api/helper";
import LottieView from "lottie-react-native";
import HTML from "react-native-render-html";
import moment from "moment";
import { useSelector } from "react-redux";
import { RootState } from "../../src/redux/store";

const ReviewsByProduct = () => {
  const paramItem = useLocalSearchParams();

  const isUserAvailable = useSelector((state: RootState) => state.auth);

  const [allReviews, setAllReviews] = useState([]);

  const [allReviewsCount, setAllReviewsCount] = useState("");

  const [initialLoad, setInitialLoad] = useState(true);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [isRefreshLoading, setIsRefreshLoading] = useState(false);

  const windowWidth = useWindowDimensions().width;

  useEffect(() => {
    fetchProductReviews(true);
  }, []);

  const fetchProductReviews = async (isRefresh?: any) => {
    if ((!hasMore && !isRefresh) || loading) return;

    setLoading(true);
    if (isRefresh) {
      setAllReviews([]);
    }
    getProductReviewByID(
      paramItem["productDetails"],
      100,
      isRefresh ? 1 : page
    ).then((response) => {
      const REVIEWS_COUNT = response.headers.get("x-wp-total");
      const totalPages = parseInt(
        response.headers.get("x-wp-totalpages") || "1",
        10
      );
      const nextPage = isRefresh ? 2 : page + 1;
      response.json().then((responseJson) => {
        setAllReviews(
          isRefresh
            ? responseJson
            : (prevReviews) => [...prevReviews, ...responseJson]
        );
        setAllReviewsCount(REVIEWS_COUNT);
        setLoading(false);
        setPage(nextPage);
        setHasMore(nextPage <= totalPages);
        if (initialLoad) {
          setInitialLoad(false);
        }
      });
    });
  };

  const checkUserAuth = () => {
    if (isUserAvailable.isAuthenticated) {
      const OBJ = {
        user_id: isUserAvailable.user.id,
        user_email: isUserAvailable.user.user_email,
        user_name: isUserAvailable.user.username,
        product_id: paramItem["productDetails"],
      };
      router.push({ pathname: "/WriteReview/", params: OBJ });
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

  const renderReviewItem = ({ item, index }: { item: any; index: number }) => (
    <View key={index} className="p-5 pb-0 pt-0">
      <View className="flex-row mt-5">
        <View className="w-[20%] items-start">
          <Image
            source={{ uri: item.reviewer_avatar_urls["96"] }}
            className="w-[50px] h-[50px] rounded-full mr-3"
          />
        </View>
        <View className="w-[60%] items-start mt-[-2px]">
          <Text className="text-lg font-semibold">{item.reviewer}</Text>
          <View className="flex-row items-center">
            <Image
              resizeMode="contain"
              source={appStyle.CLOCK_ICON}
              className="w-[16px] h-[16px] mr-1"
            />
            <Text className="text-gray-500 text-[13px]">
              {moment(item.date_created).format("LL")}
            </Text>
          </View>
        </View>
        <View className="w-[20%] items-end">
          <View className="flex-row items-center">
            <Image
              resizeMode="contain"
              source={appStyle.STAR_ICON}
              className="w-[16px] h-[16px] mr-1"
            />
            <Text className="text-[18px] font-semibold mr-1">
              {parseFloat(item.rating).toFixed(1)}
            </Text>
            <Text className="text-[12px] font-normal">rating</Text>
          </View>
        </View>
      </View>

      <View className="mt-1">
        <HTML
          contentWidth={windowWidth}
          tagsStyles={{
            p: {
              fontSize: 14,
              color: appStyle.Colors.grayColor4,
              paddingLeft: 5,
            },
          }}
          source={{ html: item.review }}
        />
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!loading || initialLoad || !hasMore) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <LottieView
          style={{
            width: "50%",
            height: 50,
            alignSelf: "center",
          }}
          source={appStyle.LOADER_FILE}
          loop={true}
          autoPlay
        />
      </View>
    );
  };

  const handleEndReached = () => {
    if (!initialLoad) {
      fetchProductReviews();
    }
  };

  const reviewsLoader = () => {
    return (
      <View>
        {[...Array(10)].map((_, index) => (
          <View
            key={index}
            className={"w-[90%] self-center rounded-lg bg-gray-100 h-20 mb-5"}
          >
            <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
          </View>
        ))}
      </View>
    );
  };

  const onRefresh = () => {
    setLoading(true);
    setIsRefreshLoading(true);
    fetchProductReviews(true);
    setPage(1);
    setTimeout(() => {
      setLoading(true);
      setIsRefreshLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        leftImage={appStyle.BACK_ICON_IMAGE}
        onLeftPress={() => router.back()}
        title={"Reviews"}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row mt-2 p-5 pt-0">
          <View className="w-[75%] justify-center items-start">
            <Text className="text-[20px] font-semibold">
              {allReviewsCount} Reviews
            </Text>
          </View>
          <View className="w-[25%] justify-center items-end">
            <TouchableOpacity onPress={() => checkUserAuth()}>
              <Image
                resizeMode="contain"
                className="w-[120px] h-[36px]"
                source={appStyle.ADD_REVIEW_ICON}
              />
            </TouchableOpacity>
          </View>
        </View>

        {isRefreshLoading ? reviewsLoader() : null}
        {loading && initialLoad ? (
          reviewsLoader()
        ) : (
          <>
            {allReviews.length > 0 ? (
              <View className="flex-1">
                <FlatList
                  data={allReviews}
                  keyExtractor={(item) => `${item.id}`}
                  renderItem={renderReviewItem}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                  onEndReached={handleEndReached}
                  onEndReachedThreshold={0.1}
                  ListFooterComponent={renderFooter}
                />
              </View>
            ) : (
              <View className="flex-1 justify-center items-center mt-10">
                <Text className="text-[18px] text-gray-400">
                  No Reviews Availabe!
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReviewsByProduct;
