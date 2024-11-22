import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import tw from "tailwind-react-native-classnames";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { GOOGLE_MAPS_APIKEY } from "@env";
import { useDispatch } from "react-redux";
import { setDestination } from "../slices/navSlice";
import { useRouter } from "expo-router";

const NavigateCard = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <SafeAreaView style={tw`bg-white flex-1`}>
      <Text className={"text-center py-5 text-xl font-nbold"}>
        Where do you want to eat?
      </Text>
      <View className={"border-t border-gray-200 flex-shrink"}>
        <View>
          <GooglePlacesAutocomplete
            placeholder="Where to?"
            styles={toInputBoxStyles}
            fetchDetails={true}
            returnKeyType={"search"}
            minLength={2}
            onPress={(data, details = null) => {
              dispatch(
                setDestination({
                  location: details.geometry.location,
                  description: data.description,
                })
              );
              // Modificado para usar pathname más específico si es necesario
              router.push({
                pathname: "/(tabs)/map",
              });
            }}
            enablePoweredByContainer={false}
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: "en",
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            debounce={400}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NavigateCard;

const toInputBoxStyles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    paddingTop: 20,
    flex: 0,
  },
  textInput: {
    borderColor: "#D3D3D3",
    borderRadius: 5,
    fontSize: 18,
    borderWidth: 1,
    padding: 10,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
});
