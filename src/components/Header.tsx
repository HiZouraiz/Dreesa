import React from "react";
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

interface HeaderProps {
  title?: string;
  leftImage?: ImageSourcePropType;
  rightImage?: ImageSourcePropType;
  onLeftPress?: () => void;
  onRightPress?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  title,
  leftImage,
  rightImage,
  onLeftPress,
  onRightPress,
}) => {
  return (
    <View className="flex flex-row items-center justify-center p-5">
      <View className="w-[15%] items-center justify-center">
        <TouchableOpacity onPress={onLeftPress}>
          <Image className="w-[50px] h-[50px]" source={leftImage} />
        </TouchableOpacity>
      </View>
      <View className="w-[70%] items-center justify-center">
        <Text className="text-[20px] font-medium">{title}</Text>
      </View>
      <View className="w-[15%] items-center justify-center">
        <TouchableOpacity onPress={onRightPress}>
          <Image className="w-[50px] h-[50px]" source={rightImage} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;
