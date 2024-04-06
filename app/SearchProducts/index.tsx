import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  useWindowDimensions,
} from "react-native";
import Modal from "react-native-modal";
import HTML from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";
import { Checkbox } from "expo-checkbox";
import appStyle from "../../src/constants/Colors";
import { router } from "expo-router";
import ButtonOne from "../../src/components/ButtonOne";
import { getAllCategories, searchProducts } from "../../src/api/helper";
import LottieView from "lottie-react-native";
import Slider from "@react-native-community/slider";

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const windowWidth = useWindowDimensions().width;
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [allCategories, setAllCategories] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchText.trim() !== "") {
      searchProductyByQuery(searchText, minPrice, maxPrice);
    } else {
      setAllProducts([]);
    }
  }, [searchText]);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    setLoading(true);

    getAllCategories()
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        setAllCategories(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const searchProductyByQuery = async (
    searchText: string,
    minPrice: number,
    maxPrice: number,
    categories?: any
  ) => {
    setLoading(true);
    searchProducts(searchText, 1, minPrice, maxPrice, categories)
      .then((response) => response.json())
      .then((responseJson) => {
        setAllProducts(responseJson);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBackgroundPress = (event: any) => {
    if (event.target === event.currentTarget) {
      setModalVisible(false);
    }
  };

  const renderProducts = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({ pathname: "/ProductDetails/", params: item })
      }
      className="flex-row w-[95%] bg-gray-100 rounded-[20px] m-2"
    >
      <View className="w-[35%]">
        <Image
          className="w-[90px] h-[110px] m-2 rounded-[20px]"
          source={{ uri: item.images[0].src }}
        />
      </View>
      <View className="w-[55%] justify-center">
        <Text
          numberOfLines={2}
          className="text-black text-[18px] font-semibold"
        >
          {item.name}
        </Text>
        <View className="mt-1">
          <HTML
            contentWidth={windowWidth}
            tagsStyles={{
              span: {
                fontWeight: "400",
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
    if (!loading) return null;
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

  const renderCategories = ({ item, index }: { item: any; index: number }) => (
    <View
      key={index}
      className={
        index === allCategories.length - 1
          ? "flex-row items-center justify-items-center rounded-lg bg-gray-100 h-[66px] mr-6"
          : "flex-row items-center justify-items-center rounded-lg bg-gray-100 h-[66px] mr-2"
      }
    >
      <Checkbox
        className="rounded-full w-6 h-6 ml-5 border-[0.5px] border-[#cccccc]"
        value={item.selected}
        onValueChange={(newValue) => {
          const updatedCategories = [...allCategories];
          updatedCategories.forEach((eachitem) => {
            if (eachitem.id === item.id) {
              eachitem.selected = newValue;
            }
          });
          setAllCategories(updatedCategories);
        }}
      />
      <Text className="font-medium text-lg mr-5 ml-2">{item.name}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-5 pt-1">
        <View className="flex-row mt-5">
          <View className="w-[18%] items-start justify-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Image
                className="w-[50px] h-[50px]"
                source={appStyle.BACK_ICON_IMAGE}
              />
            </TouchableOpacity>
          </View>
          <View className="w-[82%] flex-row items-center bg-gray-100 rounded-lg p-3">
            <Image
              resizeMode="contain"
              className="w-[22px] h-[22px]"
              source={appStyle.SEARCH_ICON}
            />
            <TextInput
              className="flex-1 w-24 text-[16px] pl-3"
              placeholder="Search..."
              placeholderTextColor="gray"
              value={searchText}
              onChange={(event) => setSearchText(event.nativeEvent.text)}
              autoFocus={true}
            />
          </View>
        </View>
      </View>

      <View className="flex-1 bg-white p-3">
        <View className="flex-1 bg-white p-3">
          <FlatList
            data={allProducts}
            keyExtractor={(item) => `${item.id || Math.random()}`}
            renderItem={renderProducts}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
          />
        </View>
      </View>

      {/* Floating Filter Icon */}
      <TouchableOpacity
        className={`absolute bottom-4 right-4 w-12 h-12 rounded-full flex items-center justify-center`}
        style={{ backgroundColor: appStyle.Colors.primaryColor }}
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-[15px]">Filter</Text>
      </TouchableOpacity>

      {/* Filter Modal */}

      <Modal
        isVisible={modalVisible}
        animationIn={"slideInUp"}
        animationOut={"slideOutDown"}
        backdropColor={"rgba(0,0,0,0.7)"}
        style={{ margin: 0 }}
        animationInTiming={700}
        animationOutTiming={700}
        backdropTransitionInTiming={50}
        backdropTransitionOutTiming={0}
      >
        <Pressable
          onPress={handleBackgroundPress}
          className="flex-1 justify-end items-center mt-2"
        >
          <View className="bg-white border border-gray-200 rounded-t-3xl w-full">
            <Text className="text-xl mb-4 font-bold p-5">Filters</Text>

            <View className="flex-row items-center justify-between  pb-6 pt-6 p-5">
              <Text className="text-[18px]">Price Range</Text>
              <Text>
                €{minPrice} - €{maxPrice}
              </Text>
            </View>

            <View className="pb-6 p-5">
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={1000}
                step={1}
                thumbTintColor={appStyle.Colors.primaryColor}
                minimumTrackTintColor={appStyle.Colors.primaryColor}
                maximumTrackTintColor={appStyle.Colors.grayColor}
                value={minPrice}
                onValueChange={(value) => setMinPrice(value)}
              />
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={0}
                maximumValue={1000}
                step={1}
                thumbTintColor={appStyle.Colors.primaryColor}
                minimumTrackTintColor={appStyle.Colors.primaryColor}
                maximumTrackTintColor={appStyle.Colors.grayColor}
                value={maxPrice}
                onValueChange={(value) => setMaxPrice(value)}
              />
            </View>

            <View className="pb-6">
              <Text className="text-[18px] mb-5 p-5 pb-0">Categories</Text>
              <FlatList
                contentContainerStyle={{ marginLeft: 20 }}
                horizontal
                data={allCategories}
                keyExtractor={(item) => `${item.id || Math.random()}`}
                renderItem={renderCategories}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </View>
        </Pressable>
        <ButtonOne
          text="SAVE FILTER"
          onPress={() => {
            const selectedCategoryIdsString = allCategories
              .filter((item) => item.selected === true && item.id > 0)
              .map((item) => item.id)
              .join(",");
            searchProductyByQuery(
              searchText,
              minPrice,
              maxPrice,
              selectedCategoryIdsString
            );
            setModalVisible(false);
          }}
        />
      </Modal>
    </SafeAreaView>
  );
};

export default Home;
