import React from "react";
import { View } from "react-native";

const ProductsLoader = () => {
  return (
    <View className="flex-row flex-wrap justify-center">
      {[...Array(8)].map((_, index) => (
        <View key={index} className="mb-5">
          <View className="w-[160px] h-[200px] m-2 rounded-[20px] bg-[#E5E7EB]" />
          <View className="w-[70%] p-2 h-[20px] mt-2 bg-[#E5E7EB] ml-4" />
          <View className="w-[40%] p-2 h-[20px] mt-2 bg-[#E5E7EB] ml-4" />
        </View>
      ))}
    </View>
  );
};

export default ProductsLoader;
