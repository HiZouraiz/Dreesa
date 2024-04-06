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
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Modal from "react-native-modal";
import HTML from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
import Menu from "../../src/components/Menu";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../src/redux/store";
import { toggleProductInWishlist } from "../../src/redux/Slice/WishlistSlice";
import LottieView from "lottie-react-native";

const Wishlist = () => {
  const [columns] = useState(2);
  const wishlistAvailableProducts = useSelector(
    (state: RootState) => state.wishlist
  );
  const dispatch = useDispatch();
  const windowWidth = useWindowDimensions().width;
  const [UserMenu, setUserMenu] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    setAllProducts(wishlistAvailableProducts);
  }, [wishlistAvailableProducts]);

  const move = () => {
    setUserMenu(false);
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
        source={{ uri: item.image }}
      >
        <TouchableOpacity
          onPress={() => dispatch(toggleProductInWishlist(item))}
          className="self-end"
        >
          <Image
            className="w-[25px] h-[25px] mr-3 mt-2"
            source={appStyle.HEART_ICON_FILL}
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

  const onRefresh = () => {
    setRefreshLoading(true);
    setAllProducts(wishlistAvailableProducts);
    setTimeout(() => {
      setRefreshLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header
        leftImage={appStyle.MENU_OPEN_ICON}
        onLeftPress={() => setUserMenu(true)}
        title="Wishlist"
        rightImage={appStyle.CART_ICON}
        onRightPress={() => router.push("/Cart/")}
      />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshLoading} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {allProducts.length < 1 ? (
          <View className="justify-center flex-1 items-center bg-white">
            <LottieView
              style={{
                width: "80%",
                height: "80%",
              }}
              source={appStyle.EMPTY_CART_FILE}
              loop={true}
              autoPlay
            />
          </View>
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
        animationOutTiming={1200}
        backdropTransitionInTiming={100}
        backdropTransitionOutTiming={1500}
      >
        <Menu UserMenu={() => setUserMenu(false)} handleClick={() => move()} />
      </Modal>
    </SafeAreaView>
  );
};

export default Wishlist;
