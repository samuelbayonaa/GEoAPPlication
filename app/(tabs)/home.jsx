import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllRestaurants, getLatestRestaurants } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import "react-native-get-random-values";
import { useDispatch } from "react-redux";
import { setDestination, setOrigin } from "../../slices/navSlice";

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useGlobalContext();

  const [restaurants, setRestaurants] = useState([]);
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const allRestaurants = await getAllRestaurants();
      const latestRestaurants = await getLatestRestaurants();
      setRestaurants(allRestaurants);
      setFeaturedRestaurants(latestRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToPlace = (restaurant) => {
    router.push({
      pathname: "/(places)/places",
      params: { restaurantId: restaurant.$id },
    });
  };

  const renderRestaurantItem = ({ item }) => (
    <TouchableOpacity
      className="p-4 mb-6 bg-white rounded-lg shadow-md"
      onPress={() => navigateToPlace(item)}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-48 mb-2 rounded-lg"
      />
      <Text className="text-lg text-black font-nbold">{item.name}</Text>
      <Text className="text-sm text-gray-600">{item.direction}</Text>
      <Text className="text-sm text-gray-600">{item.menu}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedRestaurant = ({ item }) => (
    <TouchableOpacity
      className="mb-6 mr-4"
      onPress={() => navigateToPlace(item)}
    >
      <Image source={{ uri: item.image }} className="w-64 rounded-lg h-36" />
      <Text className="mt-1 text-sm text-black font-nsemibold">
        {item.name}
      </Text>
      <Text className="text-sm text-gray-600">{item.menu}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 my-6 space-y-6">
        <Text className="mb-2 text-2xl text-black  text-center font-nbold">
          Welcome, {user?.username}
        </Text>
        <Text className="mb-2 text-xl text-center text-sky-400 font-nbold">
          Go to Restaurants!
        </Text>
        <GooglePlacesAutocomplete
          placeholder="Put your location"
          nearbyPlacesAPI="GooglePlacesSearch"
          debounce={400}
          styles={{
            container: {
              flex: 0,
              borderColor: "black",
            },
            textInput: {
              fontSize: 18,
              borderWidth: 1,
              borderColor: "#D3D3D3",
              borderRadius: 5,
              padding: 10,
            },
          }}
          onPress={(data, details = null) => {
            dispatch(
              setOrigin({
                location: details.geometry.location,
                description: data.description,
              })
            );

            router.push({
              pathname: "/map",
            });

            dispatch(setDestination(null));
          }}
          fetchDetails={true}
          returnKeyType={"search"}
          enablePoweredByContainer={false}
          minLength={2}
          query={{
            key: GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
        />
        <FlatList
          data={filteredRestaurants}
          renderItem={renderRestaurantItem}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            alignItems: "center",
          }}
          ListHeaderComponent={
            <>
              <Text className="mb-2 text-xl text-black font-nbold">
                Featured Restaurants
              </Text>
              <FlatList
                data={featuredRestaurants}
                renderItem={renderFeaturedRestaurant}
                keyExtractor={(item) => item.$id}
                showsVerticalScrollIndicator={false}
                className="mb-4"
              />
            </>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
