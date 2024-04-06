import { router, useLocalSearchParams } from "expo-router";

import Header from "../../src/components/Header";

import appStyle from "../../src/constants/Colors";

import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";

import { addProductToCart } from "../../src/redux/Slice/CartSlice";

import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  ScrollView,
  Pressable,
  useWindowDimensions,
  Alert,
  RefreshControl,
} from "react-native";

import moment from "moment";

import { SafeAreaView } from "react-native-safe-area-context";

import HTML from "react-native-render-html";

import ImageView from "react-native-image-viewing";

import ButtonOne from "../../src/components/ButtonOne";

import {
  getProductDetails,
  getProductReviewByID,
  getProductsAllVariations,
} from "../../src/api/helper";

import { RootState } from "../../src/redux/store";

const ProductDetails = () => {
  const paramItem = useLocalSearchParams();

  const dispatch = useDispatch();

  const cartProducts = useSelector((state: RootState) => state.cart);

  const [visible, setIsVisible] = useState(false);

  const [imageIndex, setImageIndex] = useState(0);

  const [loading, setLoading] = useState(false);

  const windowWidth = useWindowDimensions().width;

  const [selectedSize, setSelectedSize] = useState(null);

  const [selectedVariationId, setSelectedVariationId] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);

  const [productImages, setProductImages] = useState([]);

  const [productName, setProductName] = useState("");

  const [productPrice, setProductPrice] = useState("");

  const [productDescription, setProductDescription] = useState("");

  const [productThumbnail, setProductThumbnail] = useState("");

  const [productAllDetails, setProductAllDetails] = useState([]);

  const [productStockStatus, setProductStockStatus] = useState("");

  const [productAttributes, setProductAttributes] = useState([]);

  const [productVariations, setProductVariations] = useState([]);

  const [allReviews, setAllReviews] = useState([]);

  const [alreadyInCart, setAlreadyInCart] = useState(false);

  const [showMore, setShowMore] = useState(false);

  const [refreshLoading, setRefreshLoading] = useState(false);

  const [availableColors, setAvailableColors] = useState<{
    [key: string]: boolean;
  }>({});

  const [availableSizes, setAvailableSizes] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const sizes = productAttributes.find((attr) => attr.slug === "pa_size");
  const colors = productAttributes.find((attr) => attr.slug === "pa_color");

  useEffect(() => {
    checkInCart();
  }, [cartProducts]);

  const checkInCart = () => {
    const isInCart = cartProducts.some(
      (item) => item.id.toString() === paramItem["id"]
    );

    setAlreadyInCart(isInCart);
  };

  const fetchProductDetails = async () => {
    setLoading(true);

    getProductDetails(paramItem["id"])
      .then((response) => response.json())

      .then((responseJson) => {
        setProductAllDetails(responseJson);

        setProductStockStatus(responseJson.stock_status);

        setProductName(responseJson.name);

        setProductPrice(responseJson.price_html);

        setProductDescription(responseJson.description);

        setProductThumbnail(responseJson.images[0].src);

        const formattedImages = responseJson.images.map(
          (image: { src: any }) => ({
            uri: image.src,
          })
        );

        setProductImages(formattedImages);

        setProductAttributes(responseJson.attributes);

        fetchProductVariations();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchProductVariations = async () => {
    getProductsAllVariations(paramItem["id"])
      .then((response) => response.json())

      .then((responseJson) => {
        setProductVariations(responseJson);

        const colors: { [key: string]: boolean } = {};

        const sizes: { [key: string]: boolean } = {};

        responseJson.forEach(
          (variation: { attributes: any[]; stock_status: string }) => {
            variation.attributes.forEach((attr) => {
              if (attr.slug === "pa_color") {
                colors[attr.option] = variation.stock_status === "instock";
              } else if (attr.slug === "pa_size") {
                sizes[attr.option] = variation.stock_status === "instock";
              }
            });
          }
        );

        setAvailableColors(colors);

        setAvailableSizes(sizes);

        fetchProductReviews();
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const fetchProductReviews = async () => {
    getProductReviewByID(paramItem["id"], 1, 1)
      .then((response) => response.json())

      .then((responseJson) => {
        setAllReviews(responseJson);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const renderProductImageThumbnails = ({
    item,

    index,
  }: {
    item: any;

    index: number;
  }) => (
    <TouchableOpacity
      key={index}
      className={index === 0 ? "ml-3" : "ml-0"}
      onPress={() => {
        setImageIndex(index);

        setIsVisible(true);
      }}
    >
      <Image source={item} className="w-[80px] h-[80px] m-2 rounded-[15px]" />
    </TouchableOpacity>
  );

  const renderSizes = ({ item, index }: { item: string; index: number }) => {
    const isAvailable = availableSizes[item];
    const isSelected = selectedSize === item;
    const isDisabled = !isAvailable || (isSelected && !isAvailable);

    const variationId = productVariations.find((variation) => {
      return variation.attributes.find(
        (attr: { option: string; slug: string }) =>
          attr.option === item && attr.slug === "pa_size"
      );
    })?.id;

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedSize(item);
          setSelectedVariationId(variationId);
        }}
        style={{
          backgroundColor: isSelected
            ? appStyle.Colors.primaryColor
            : isDisabled
            ? "#F0F0F0"
            : appStyle.Colors.lightGrayColor2,
          marginLeft: index === 0 ? 20 : 0,
        }}
        className={`w-auto p-3 pr-4 pl-4 rounded-lg mr-3 ${
          isDisabled ? "opacity-20" : ""
        }`}
        disabled={isDisabled}
      >
        <Text
          className="font-medium text-[17px]"
          style={{
            color: isSelected ? "white" : "black",
            textDecorationLine: isDisabled ? "line-through" : "none",
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderColors = ({ item, index }: { item: string; index: number }) => {
    const isAvailable = availableColors[item];
    const isSelected = selectedColor === item;
    const isDisabled = !isAvailable || (isSelected && !isAvailable);

    return (
      <TouchableOpacity
        onPress={() => setSelectedColor(item)}
        style={{
          backgroundColor: isSelected
            ? appStyle.Colors.primaryColor
            : isDisabled
            ? "#F0F0F0"
            : appStyle.Colors.lightGrayColor2,
          marginLeft: index === 0 ? 20 : 0,
        }}
        className={`w-auto p-3 pr-4 pl-4 rounded-lg mr-3 ${
          isDisabled ? "opacity-20" : ""
        }`}
        disabled={isDisabled}
      >
        <Text
          className="font-medium text-[17px]"
          style={{
            color: isSelected ? "white" : "black",
            textDecorationLine: isDisabled ? "line-through" : "none",
          }}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderReviewItem = ({ item }: { item: any }) => (
    <View className="mb-2">
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

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      Alert.alert(
        "Invalid!",
        "Please select a color and size before adding to cart"
      );
      return;
    }

    dispatch(addProductToCart({ ...productAllDetails, selectedVariationId }));
  };

  const truncateText = (text: string, lines: number) => {
    const splitText = text.split("</p>");
    return splitText.slice(0, lines).join("</p>");
  };

  const onRefresh = () => {
    setLoading(true);
    setRefreshLoading(true);
    fetchProductDetails();
    setTimeout(() => {
      setLoading(false);
      setRefreshLoading(false);
    }, 2000);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshLoading} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View
            className={
              "w-[90%] self-center rounded-lg bg-gray-100 h-[400px] mb-5 mt-5"
            }
          >
            <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
          </View>
        ) : (
          <>
            {productThumbnail && (
              <Pressable
                onPress={() => {
                  setImageIndex(0);
                  setIsVisible(true);
                }}
              >
                <ImageBackground
                  resizeMode="cover"
                  className="w-full h-[500px]"
                  source={{ uri: productThumbnail }}
                >
                  <Header
                    leftImage={appStyle.BACK_ICON_IMAGE_WHITE}
                    onLeftPress={() => router.back()}
                    rightImage={appStyle.CART_ICON_WHITE}
                    onRightPress={() => router.push("/Cart/")}
                  />
                </ImageBackground>
              </Pressable>
            )}
          </>
        )}

        {productImages.length > 0 && (
          <ImageView
            images={productImages}
            imageIndex={imageIndex}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
        )}

        <View className="h-full rounded-3xl mt-[-5%] bg-white ">
          {loading ? (
            <View
              className={
                "w-[90%] self-center rounded-lg bg-gray-100 h-10 mb-5 mt-5"
              }
            >
              <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
            </View>
          ) : (
            <View className="flex-row p-5">
              <View className="w-[63%] items-start">
                <Text className="text-[22px] font-semibold">{productName}</Text>
              </View>
              <View className="w-[37%] items-end">
                <View className="mt-1">
                  <HTML
                    contentWidth={windowWidth}
                    tagsStyles={{
                      span: {
                        fontWeight: "600",
                        fontSize: 17,
                        color: appStyle.Colors.black2Color,
                      },
                    }}
                    source={{ html: productPrice }}
                  />
                </View>
              </View>
            </View>
          )}

          <View className="mt-[-3%]">
            {loading ? (
              <View
                className={
                  "w-[90%] self-center rounded-lg bg-gray-100 h-20 mb-5"
                }
              >
                <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
              </View>
            ) : (
              <FlatList
                horizontal
                data={productImages}
                keyExtractor={(item) => `${item.id || Math.random()}`}
                renderItem={renderProductImageThumbnails}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>

          {loading ? (
            <View
              className={
                "w-[90%] self-center rounded-lg bg-gray-100 h-20 mb-5 "
              }
            >
              <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
            </View>
          ) : (
            <View>
              {sizes && (
                <View>
                  <View className="flex-row mt-5 p-5 pt-0">
                    <View className="w-[75%] justify-center items-start">
                      <Text className="text-[20px] font-semibold">Size</Text>
                    </View>
                    <View className="w-[25%] justify-center items-end"></View>
                  </View>
                  <FlatList
                    horizontal
                    data={sizes.options}
                    keyExtractor={(item) => `${item}`}
                    renderItem={renderSizes}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}
              {colors && (
                <View>
                  <View className="flex-row mt-5 p-5 pt-0">
                    <View className="w-[75%] justify-center items-start">
                      <Text className="text-[20px] font-semibold">Color</Text>
                    </View>
                    <View className="w-[25%] justify-center items-end"></View>
                  </View>
                  <FlatList
                    horizontal
                    data={colors.options}
                    keyExtractor={(item) => `${item}`}
                    renderItem={renderColors}
                    showsHorizontalScrollIndicator={false}
                  />
                </View>
              )}
            </View>
          )}

          {loading ? (
            <View
              className={
                "w-[90%] self-center rounded-lg bg-gray-100 h-[100px] mb-5"
              }
            >
              <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
            </View>
          ) : (
            <View className="p-5 pt-2 mt-5">
              <Text className="text-[20px] font-semibold">Description</Text>
              <View>
                <HTML
                  contentWidth={windowWidth}
                  tagsStyles={{
                    p: { fontSize: 16, color: "#6B7280" },
                  }}
                  source={{
                    html: showMore
                      ? productDescription
                      : truncateText(productDescription, 1),
                  }}
                />

                <TouchableOpacity onPress={toggleShowMore}>
                  <Text style={{ color: "blue" }}>
                    {showMore ? "Show less" : "Show more"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading ? (
            <View
              className={
                "w-[90%] self-center rounded-lg bg-gray-100 h-[100px] mb-5"
              }
            >
              <Text className="font-medium text-lg mr-5 ml-2 text-gray-500"></Text>
            </View>
          ) : (
            <>
              <View className="flex-row  p-5 pt-0 pb-2">
                <View className="w-[75%] justify-center items-start">
                  <Text className="text-[20px] font-semibold">Reviews</Text>
                </View>
                <View className="w-[25%] justify-center items-end">
                  <TouchableOpacity
                    onPress={() =>
                      router.push({
                        pathname: "/ReviewsByProduct/",
                        params: {
                          productDetails: paramItem["id"],
                        },
                      })
                    }
                  >
                    <Text className="text-[15px] font-medium text-gray-400">
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {allReviews.length > 0 ? (
                <View className="p-5 pt-0">
                  <FlatList
                    data={allReviews}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderReviewItem}
                    scrollEnabled={false}
                  />
                </View>
              ) : (
                <View className="justify-center items-center mt-7 mb-7">
                  <Text className="text-[18px] text-gray-400">
                    No Reviews Availabe!
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
      {loading ? null : (
        <>
          {productStockStatus === "instock" ? (
            <>
              {alreadyInCart ? (
                <ButtonOne
                  onPress={() => router.push("/Cart/")}
                  text="Go To Cart"
                />
              ) : (
                <ButtonOne
                  onPress={() => handleAddToCart()}
                  text="Add to cart"
                />
              )}
            </>
          ) : (
            <View className="p-5 justify-center items-center">
              <Text
                style={{ color: appStyle.Colors.primaryColor }}
                className="text-[17px] font-bold"
              >
                This product is out of stock
              </Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ProductDetails;
