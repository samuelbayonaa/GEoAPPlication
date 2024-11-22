import { View, Image, TouchableOpacity, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useCallback } from "react";

import {
  getRestaurantsByOwner,
  signOut,
  getItinerariesByUserId,
  getRestaurantById,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import InfoBox from "../../components/InfoBox";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getRestaurantsByOwner(user.$id));
  const { data: itineraries = [] } = useAppwrite(() =>
    getItinerariesByUserId(user.$id)
  );

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("es-ES", options);
  }, []);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
      setIsLogged(false);
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const renderItinerary = useCallback(
    ({ item }) => {
      if (!item || !item.$id) return null;

      return (
        <View className="bg-gray-50 p-4 rounded-lg mb-4 mx-4 border border-gray-200">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-nbold text-gray-800">
              Number of people {item.numberOfPeople}{" "}
              {item.numberOfPeople === 1 ? "Person" : "People"}
            </Text>
          </View>
          <Text className="text-sm font-nregular text-gray-600">
            {formatDate(item.visitDate)}
          </Text>
          <RestaurantInfo restaurantId={item.restaurantId} />
        </View>
      );
    },
    [formatDate]
  );

  const ListHeader = useCallback(
    () => (
      <View className="flex items-center justify-center w-full px-4 mt-6 mb-12">
        <Text className="mb-2 text-3xl text-black text-center font-nbold">
          GeoApp
        </Text>
        <TouchableOpacity
          onPress={logout}
          className="flex items-end w-full mb-10"
        >
          <Image
            source={icons.logout}
            resizeMode="contain"
            className="w-6 h-6"
          />
        </TouchableOpacity>

        <View className="flex items-center justify-center w-16 h-16 border rounded-lg border-sky-400">
          <Image
            source={{ uri: user?.avatar }}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode="cover"
          />
        </View>

        <InfoBox
          title={user?.username}
          containerStyles="mt-5"
          titleStyles="text-lg"
        />
        <InfoBox
          title={user?.email}
          containerStyles="mt-5"
          titleStyles="text-lg"
        />
        <InfoBox
          title={user?.role}
          containerStyles="mt-5"
          titleStyles="text-lg"
        />

        <Text className="text-2xl font-nbold text-gray-800 mt-8 mb-4">
          My itineraries
        </Text>
      </View>
    ),
    [user, logout]
  );

  const ListEmptyComponent = useCallback(
    () => (
      <View className="flex items-center justify-center px-4">
        <Text className="text-gray-500 text-lg">No itineraries found</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        data={itineraries}
        renderItem={renderItinerary}
        keyExtractor={useCallback(
          (item) => item?.$id?.toString() || Math.random().toString(),
          []
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmptyComponent}
        removeClippedSubviews={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
    </SafeAreaView>
  );
};

const RestaurantInfo = ({ restaurantId }) => {
  const { data: restaurant } = useAppwrite(() =>
    getRestaurantById(restaurantId)
  );

  if (!restaurant) {
    return <Text className="text-gray-500">Loading Information</Text>;
  }

  return (
    <View className="mt-2">
      <Text className="text-base font-nmedium text-gray-700">
        {restaurant.name}
      </Text>
      <Text className="text-sm font-nregular text-gray-600">
        {restaurant.direction}
      </Text>
      <Text className="text-sm font-nregular text-gray-600">
        {restaurant.type}
      </Text>
    </View>
  );
};

export default Profile;
