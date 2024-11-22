import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Image, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getRestaurantsByOwner } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const HomeRestaurant = () => {
  const { user } = useGlobalContext();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRestaurants = async () => {
    try {
      if (user && user.$id) {
        const fetchedRestaurants = await getRestaurantsByOwner(user.$id);
        setRestaurants(fetchedRestaurants);
      }
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRestaurants();
    setRefreshing(false);
  }, []);

  const renderRestaurantItem = ({ item }) => (
    <View className="p-4 mb-4 bg-white rounded-lg ">
      <Image
        source={{ uri: item.image }}
        className="w-full h-48 mb-2 rounded-lg"
      />
      <Text className="text-lg text-black font-nbold">{item.name}</Text>
      <Text className="text-sm text-black">{item.direction}</Text>
      <Text className="mt-1 text-sm text-black">{item.type}</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="items-center justify-center flex-1 bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <Text className="mb-4 text-2xl font-nbold">Welcome</Text>
        {restaurants.length > 0 ? (
          <FlatList
            ListHeaderComponent={() => (
              <View className="flex items-center justify-center w-full px-4 mt-6 mb-12">
                <Text className="mb-4 text-xl font-nbold">
                  Your Restaurants
                </Text>
              </View>
            )}
            data={restaurants}
            renderItem={renderRestaurantItem}
            keyExtractor={(item) => item.$id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Text className="text-lg text-center">
            You don't have any restaurants yet.
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default HomeRestaurant;
