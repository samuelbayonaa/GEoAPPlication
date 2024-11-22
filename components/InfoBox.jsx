import { View, Text } from "react-native";

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      <Text className={`text-black text-center font-nsemibold ${titleStyles}`}>
        {title}
      </Text>
      <Text className="text-sm text-black text-center font-nregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox;
