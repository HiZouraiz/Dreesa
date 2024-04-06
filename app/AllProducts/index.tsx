import { router } from "expo-router";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HTML from "react-native-render-html";
import { getAllProducts } from "../../src/api/helper";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../src/redux/store";
import { toggleProductInWishlist } from "../../src/redux/Slice/WishlistSlice";
import ProductsLoader from "../../src/components/ProductsLoader";

const AllProducts = () => {
  const [columns] = useState(2);

  const wishlistAvailableProducts = useSelector(
    (state: RootState) => state.wishlist
  );

  const dispatch = useDispatch();

  const windowWidth = useWindowDimensions().width;

  const [allProducts, setAllProducts] = useState([]);

  const [allProductsCount, setAllProductsCount] = useState("");

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  const [initialLoad, setInitialLoad] = useState(true);

  const [loading, setLoading] = useState(false);

  const [isRefreshLoading, setIsRefreshLoading] = useState(false);

  useEffect(() => {
    fetchAllProducts(true);
  }, []);

  const fetchAllProducts = async (isRefresh?: any) => {
    if ((!hasMore && !isRefresh) || loading) return;

    setLoading(true);
    if (isRefresh) {
      setAllProducts([]);
    }
    getAllProducts(isRefresh ? 1 : page).then((response) => {
      const PRODUCT_COUNT = response.headers.get("x-wp-total");
      const totalPages = parseInt(
        response.headers.get("x-wp-totalpages") || "1",
        10
      );
      const nextPage = isRefresh ? 2 : page + 1;
      response.json().then((responseJson) => {
        setAllProducts(
          isRefresh
            ? responseJson
            : (prevProducts) => [...prevProducts, ...responseJson]
        );
        setAllProductsCount(PRODUCT_COUNT);
        setLoading(false);
        setPage(nextPage);
        setHasMore(nextPage <= totalPages);
        if (initialLoad) {
          setInitialLoad(false);
        }
      });
    });
  };

  const renderProducts = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/ProductDetails/", params: item })
      }
    >
      <ImageBackground
        className="w-[160px] h-[200px] m-2"
        imageStyle={{ borderRadius: 20 }}
        source={{ uri: item.images[0].src }}
      >
        <TouchableOpacity
          onPress={() => dispatch(toggleProductInWishlist(item))}
          className="self-end"
        >
          <Image
            className="w-[25px] h-[25px] mr-3 mt-2"
            source={
              wishlistAvailableProducts.some(
                (product: { id: any }) => product.id === item.id
              )
                ? appStyle.HEART_ICON_FILL
                : appStyle.HEART_ICON
            }
          />
        </TouchableOpacity>
      </ImageBackground>

      <View className="w-[160px] p-2">
        <Text numberOfLines={2} className="text-black text-[15px]">
          {item.name}
        </Text>
        <View className="mt-1">
          <HTML
            contentWidth={windowWidth}
            tagsStyles={{
              span: {
                fontWeight: "600",
                fontSize: 16,
                color: appStyle.Colors.black2Color,
              },
            }}
            source={{ html: item.price_html }}
          />
        </View>
      </View>
    </TouchableOpacity>
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
      fetchAllProducts();
    }
  };

  const onRefresh = () => {
    setInitialLoad(true);
    setIsRefreshLoading(true);
    fetchAllProducts(true);
    setTimeout(() => {
      setIsRefreshLoading(false);
      setInitialLoad(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        leftImage={appStyle.BACK_ICON_IMAGE}
        onLeftPress={() => router.back()}
        title={""}
        rightImage={appStyle.CART_ICON}
        onRightPress={() => router.push("/Cart/")}
      />

      <View className="flex-row p-5 pt-0">
        <View className="w-[75%] justify-center items-start">
          <Text className="text-[20px] font-semibold">
            {allProductsCount} Items
          </Text>
          <Text className="text-[17px] text-gray-300 ">Available in stock</Text>
        </View>
        <View className="w-[25%] justify-center items-end">
          <TouchableOpacity>
            <Image
              resizeMode="contain"
              className="w-[75px] h-[75px]"
              source={appStyle.SORT_ICON}
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading && initialLoad ? (
        <ProductsLoader />
      ) : (
        <View className="flex-1 items-center bg-white">
          <FlatList
            data={allProducts}
            keyExtractor={(item) => `${item.id || Math.random()}`}
            renderItem={renderProducts}
            numColumns={columns}
            showsVerticalScrollIndicator={false}
            scrollEnabled={true}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshLoading}
                onRefresh={onRefresh}
              />
            }
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default AllProducts;
