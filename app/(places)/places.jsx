import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRestaurantById } from "../../lib/appwrite";
import { CustomButton } from "../../components";

const Places = () => {
  const { restaurantId } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter(); // Cambiar a useRouter para la navegación

  const fetchRestaurantData = useCallback(async () => {
    try {
      if (restaurantId) {
        const restaurantData = await getRestaurantById(restaurantId);
        setRestaurant(restaurantData);
      }
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  }, [restaurantId]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRestaurantData();
    setRefreshing(false);
  }, [fetchRestaurantData]);

  const goToReview = () => {
    router.push({
      pathname: "/review",
      params: { restaurantId: restaurantId }, // Pasar el restaurantId como parámetro
    });
  };

  if (!restaurant) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text className="text-lg text-black">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text className="mb-6 text-2xl text-black font-nbold">
          Details of Restaurant
        </Text>
        <TouchableOpacity className="p-4 mb-4 bg-white rounded-lg shadow-md">
          <Image
            source={{ uri: restaurant.image }}
            className="w-full h-48 mb-2 rounded-lg"
          />
          <Text className="text-lg text-black font-nbold">
            Name: {restaurant.name}
          </Text>
          <Text className="text-sm text-black">
            Addres: {restaurant.direction}
          </Text>
          <Text className="mt-1 text-sm text-black">
            Destacate Food: {restaurant.menu}
          </Text>
          <Text className="mt-1 text-sm text-black">
            Type of place: {restaurant.type}
          </Text>
        </TouchableOpacity>
        <CustomButton
          title="Go to Review"
          handlePress={goToReview}
          containerStyles="mt-7"
          isLoading={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Places;
