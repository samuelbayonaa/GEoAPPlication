import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  getRestaurantsByOwner,
  getReviewsByRestaurantId,
} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const resultsReview = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    if (user) {
      try {
        const fetchedRestaurants = await getRestaurantsByOwner(user.$id);
        setRestaurants(fetchedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    }
  }, [user]);

  const fetchReviews = useCallback(async (restaurantId) => {
    try {
      const fetchedReviews = await getReviewsByRestaurantId(restaurantId);
      setReviews(fetchedReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }, []);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRestaurants();
    setRefreshing(false);
  }, [fetchRestaurants]);

  const handleRestaurantSelect = (restaurant) => {
    setSelectedRestaurant(restaurant);
    fetchReviews(restaurant.$id);
  };

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRestaurantSelect(item)}>
      <View className="p-4 mb-4 bg-gray-100 rounded-lg">
        <Text className="text-lg font-bold">{item.name}</Text>
        <Text>{item.direction}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderReviewItem = ({ item }) => (
    <View className="p-4 mb-2 bg-gray-50 rounded-lg">
      <Text>Rating Place: {item.ratingPlace}</Text>
      <Text>Rating Dish: {item.ratingDish}</Text>
      <Text>Rating Service: {item.ratingService}</Text>
      <Text>Review: {item.writeReview}</Text>
      <Text>Recommendation: {item.recommendation ? "Yes" : "No"}</Text>
    </View>
  );

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        ListHeaderComponent={() => (
          <View className="flex items-center justify-center w-full px-4 mt-6 mb-12">
            <Text className="mb-2 text-3xl text-black text-center font-nbold">
              GeoApp
            </Text>
            <Text className="mb-4 text-xl font-bold">Your Restaurants</Text>
          </View>
        )}
        data={restaurants}
        renderItem={renderRestaurantItem}
        keyExtractor={(item) => item.$id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {selectedRestaurant && (
        <View className="mt-8">
          <Text className="mb-4 text-xl font-bold">
            Reviews for {selectedRestaurant.name}
          </Text>
          <FlatList
            data={reviews}
            renderItem={renderReviewItem}
            keyExtractor={(item) => item.$id}
            ListEmptyComponent={() => (
              <Text>No reviews available for this restaurant.</Text>
            )}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default resultsReview;
