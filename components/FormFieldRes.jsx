import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";

import { icons } from "../constants";

const FormFieldRes = ({
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <View className="flex flex-row items-center w-full h-16 px-4 bg-white border-2 border-gray-300 rounded-2xl focus:border-green-500">
        <TextInput
          className="flex-1 text-base text-black font-nsemibold"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#DADADA"
          onChangeText={handleChangeText}
          secureTextEntry={placeholder === "Password" && !showPassword}
          {...props}
        />

        {placeholder === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormFieldRes;
