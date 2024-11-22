import { router } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle, buttomtitle }) => {
  return (
    <View className="flex items-center justify-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[216px]"
        resizeMode="contain"
      />

      <Text className="mt-2 text-xl text-center text-black font-nsemibold">
        {title}
      </Text>
      <Text className="text-sm text-black font-nsemibold">{subtitle}</Text>

      <CustomButton
        title={buttomtitle}
        handlePress={() => router.push("/home")}
        containerStyles="w-full my-5"
      />
    </View>
  );
};

export default EmptyState;
