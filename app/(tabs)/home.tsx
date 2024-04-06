import { router } from "expo-router";
import Header from "../../src/components/Header";
import appStyle from "../../src/constants/Colors";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Modal from "react-native-modal";

import HTML from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../../src/components/Menu";
import { getAllCategories, getAllProducts } from "../../src/api/helper";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../src/redux/store";
import { toggleProductInWishlist } from "../../src/redux/Slice/WishlistSlice";
import ProductsLoader from "../../src/components/ProductsLoader";
import GetPushToken from "../../src/utils/GetPushToken";

const Home = () => {
  const [columns] = useState(2);
  const wishlistAvailableProducts = useSelector(
    (state: RootState) => state.wishlist
  );
  const isUserAvailable = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const windowWidth = useWindowDimensions().width;
  const [UserMenu, setUserMenu] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  useEffect(() => {
    GetPushToken(null, isUserAvailable.user, true);
    if (isUserAvailable.isAuthenticated) {
      GetPushToken(isUserAvailable.user["id"], isUserAvailable.user, false);
    }
  }, [isUserAvailable]);
  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    setLoading(true);

    getAllCategories()
      .then((response) => response.json())
      .then((responseJson) => {
        setAllCategories(responseJson);
        fetchAllProducts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchAllProducts = async () => {
    getAllProducts(1)
      .then((response) => response.json())
      .then((responseJson) => {
        setAllProducts(responseJson);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const move = () => {
    setUserMenu(false);
  };

  const renderCategories = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/ProductsByCategory/", params: item })
      }
      className={
        index === allCategories.length - 1
          ? "flex-row items-center justify-items-center rounded-lg bg-gray-100 h-[66px] ml-2 mr-6"
          : "flex-row items-center justify-items-center rounded-lg bg-gray-100 h-[66px] ml-2"
      }
    >
      {item.image && item.image.src ? (
        <Image
          resizeMode="contain"
          source={{ uri: item.image.src }}
          className="w-[50px] h-[50px] m-2"
        />
      ) : (
        <Image
          resizeMode="contain"
          source={appStyle.CATEGORY_ICON}
          className="w-[40px] h-[40px] m-2"
        />
      )}
      <Text className="font-medium text-lg mr-5 ml-2">{item.name}</Text>
    </TouchableOpacity>
  );

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
                (product) => product.id === item.id
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

  const categoriesLoader = () => {
    return (
      <View className="flex-row justify-center items-center">
        {[...Array(3)].map((_, index) => (
          <View
            key={index}
            className={
              index === 0
                ? "w-[200px] rounded-lg bg-gray-100 h-16 ml-[70%]"
                : "w-[200px] rounded-lg bg-gray-100 h-16 ml-2"
            }
          >
            <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
          </View>
        ))}
      </View>
    );
  };

  const onRefresh = () => {
    setLoading(true);
    setRefreshLoading(true);
    fetchAllProducts();
    setTimeout(() => {
      setLoading(false);
      setRefreshLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <Header
          leftImage={appStyle.MENU_OPEN_ICON}
          onLeftPress={() => setUserMenu(true)}
          rightImage={appStyle.CART_ICON}
          onRightPress={() => router.push("/Cart/")}
        />

        <View className="p-5 pt-1">
          <Text className="text-4xl font-semibold mt-3">Hemendra</Text>
          <Text className="text-[18px] text-gray-400">Welcome to Laza.</Text>

          <View className="flex-row mt-5">
            <TouchableOpacity
              onPress={() => router.push("/SearchProducts/")}
              className="w-[85%] flex-row items-center bg-gray-100 rounded-lg p-3"
            >
              <Image
                resizeMode="contain"
                className="w-[22px] h-[22px]"
                source={appStyle.SEARCH_ICON}
              />
              <TextInput
                className="flex-1 w-24 text-[16px] pl-3"
                placeholder="Search..."
                placeholderTextColor="gray"
                editable={false}
              />
            </TouchableOpacity>
            <View className="w-[15%] items-center justify-center">
              <TouchableOpacity onPress={() => router.push("/SearchProducts/")}>
                <Image
                  resizeMode="contain"
                  className="w-[53px] h-[53px] ml-3"
                  source={appStyle.SEARCH_RESULT_ICON}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex-row mt-5 p-5 pt-0">
          <View className="w-[75%] justify-center items-start">
            <Text className="text-[20px] font-semibold">Choose Brand</Text>
          </View>
          <View className="w-[25%] justify-center items-end">
            {/* <TouchableOpacity>
              <Text className="text-[15px] font-medium text-gray-400">
                View All
              </Text>
            </TouchableOpacity> */}
          </View>
        </View>

        {loading ? (
          categoriesLoader()
        ) : (
          <FlatList
            horizontal
            data={allCategories}
            keyExtractor={(item) => `${item.id || Math.random()}`}
            renderItem={renderCategories}
            contentContainerStyle={{ margin: 10, marginTop: 0 }}
            showsHorizontalScrollIndicator={false}
          />
        )}

        <View className="flex-row mt-5 p-5 pt-0">
          <View className="w-[75%] justify-center items-start">
            <Text className="text-[20px] font-semibold">New Arraival</Text>
          </View>
          <View className="w-[25%] justify-center items-end">
            <TouchableOpacity onPress={() => router.push("/AllProducts/")}>
              <Text className="text-[15px] font-medium text-gray-400">
                View All
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <ProductsLoader />
        ) : (
          <View className="flex-1 items-center bg-white">
            <FlatList
              data={allProducts}
              keyExtractor={(item) => `${item.id || Math.random()}`}
              renderItem={renderProducts}
              numColumns={columns}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      <Modal
        isVisible={UserMenu}
        animationIn={"slideInLeft"}
        animationOut={"slideOutLeft"}
        backdropColor={"rgba(0,0,0,0.7)"}
        style={{ margin: 0 }}
        animationInTiming={100}
        animationOutTiming={600}
        backdropTransitionInTiming={50}
        backdropTransitionOutTiming={0}
      >
        <Menu UserMenu={() => setUserMenu(false)} handleClick={() => move()} />
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
