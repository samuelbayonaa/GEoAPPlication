import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { CustomButton, Loader } from "../components";
import { useGlobalContext } from "../context/GlobalProvider";

const Welcome = () => {
  const { loading, user } = useGlobalContext();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "OwnerofRestaurant") {
        router.replace("/(tabs_res)/homeRestaurant");
      } else {
        router.replace("/(tabs)/home");
      }
    }
  }, [loading, user]);

  if (loading) {
    return <Loader isLoading={true} />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="flex items-center justify-center w-full h-full px-4">
          <Image
            source={images.logo}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-center text-primary font-nbold">
              GeoApp{"\n"}Welcome!
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm text-center font-nregular text-black-100 mt-7">
            Discover Bogotá’s Culinary Treasures: Unleash Your Inner Foodie with
            Our Local Gastronomic Guides.
          </Text>
          <CustomButton
            title="Go Geo!"
            handlePress={() => router.push("/(auth)/sign-in")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
