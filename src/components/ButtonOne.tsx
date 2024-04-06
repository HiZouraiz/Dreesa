import React from "react";
import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import appStyle from "../constants/Colors";

interface ButtonOneProps extends TouchableOpacityProps {
  text: string;
}

const ButtonOne: React.FC<ButtonOneProps> = ({ text, onPress, ...props }) => {
  return (
    <TouchableOpacity
      className={`p-5 items-center justify-center`}
      style={{ backgroundColor: appStyle.Colors.primaryColor }}
      onPress={onPress}
      {...props}
    >
      <Text className="text-white text-[18px]">{text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonOne;
