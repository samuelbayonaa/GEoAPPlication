import { View, Image, TouchableOpacity, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import { getRestaurantsByOwner, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import InfoBox from "../../components/InfoBox";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const { data: posts } = useAppwrite(() => getRestaurantsByOwner(user.$id));

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <FlatList
        ListHeaderComponent={() => (
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
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
