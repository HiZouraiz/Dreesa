import React from "react";
import {
  View,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from "react-native";

interface TextFieldProps extends TextInputProps {
  placeholder: string;
  containerStyle?: ViewStyle;
}

const TextField: React.FC<TextFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
}) => {
  return (
    <View className="border-b border-gray-500 border-opacity-100">
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        className="text-2xl"
      />
    </View>
  );
};

export default TextField;
