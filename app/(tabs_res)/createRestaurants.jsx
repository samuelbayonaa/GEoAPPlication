import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import CustomButtomRes from "../../components/CustomButtonRes";
import FormField from "../../components/FormField";
import { icons } from "../../constants";
import { createRestaurant } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { GOOGLE_MAPS_APIKEY } from "@env";
import FormFieldRes from "../../components/FormFieldRes";

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    direction: "",
    menu: "",
    type: "",
    image: null,
  });

  const googlePlacesRef = useRef(null);

  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["*/*"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          image: result.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };

  const submit = async () => {
    if (
      form.name === "" ||
      form.direction === "" ||
      form.menu === "" ||
      form.type === "" ||
      !form.image
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      await createRestaurant({
        ...form,
        userId: user.$id,
      });

      Alert.alert("Success", "Restaurant uploaded successfully");
      router.push("/homeRestaurant");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setForm({
        name: "",
        direction: "",
        menu: "",
        type: "",
        image: null,
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={Platform.OS === "ios"}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-4 py-6">
          <Text className="text-2xl text-black font-nsemibold mb-6">
            Create your Restaurant
          </Text>

          <FormFieldRes
            value={form.name}
            placeholder="Name of restaurant"
            handleChangeText={(e) => setForm({ ...form, name: e })}
          />

          <View className="my-4">
            <Text className="text-base text-gray-100 font-nmedium mb-2">
              Image
            </Text>
            <TouchableOpacity onPress={() => openPicker("image")}>
              {form.image ? (
                <Image
                  source={{ uri: form.image.uri }}
                  resizeMode="cover"
                  className="w-full h-64 rounded-2xl"
                />
              ) : (
                <View className="flex flex-row items-center justify-center w-full h-16 px-4 space-x-2 border-2 border-gray-300 bg-white-100 rounded-2xl">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    alt="upload"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-nmedium">
                    Choose a file
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View className="my-4 z-50">
            <Text className="text-base text-gray-100 font-nmedium mb-2">
              Location
            </Text>
            <GooglePlacesAutocomplete
              ref={googlePlacesRef}
              placeholder="Put your location"
              nearbyPlacesAPI="GooglePlacesSearch"
              debounce={400}
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (details && details.geometry && details.geometry.location) {
                  const description = data.description;
                  setForm({
                    ...form,
                    direction: description,
                  });
                } else {
                  Alert.alert("Error", "Location details not found.");
                }
              }}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: "en",
              }}
              styles={{
                container: {
                  flex: 0,
                },
                textInputContainer: {
                  width: "100%",
                },
                textInput: {
                  height: 64,
                  borderRadius: 16,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  fontSize: 16,
                  borderWidth: 2,
                  borderColor: "#E5E7EB",
                  backgroundColor: "white",
                  fontWeight: "600",
                },
                listView: {
                  backgroundColor: "white",
                  borderRadius: 16,
                  marginTop: 5,
                },
                row: {
                  padding: 13,
                  height: 44,
                  flexDirection: "row",
                },
                separator: {
                  height: 0.5,
                  backgroundColor: "#c8c7cc",
                },
              }}
            />
          </View>

          <FormFieldRes
            value={form.menu}
            placeholder="Destacates food"
            handleChangeText={(e) => setForm({ ...form, menu: e })}
          />

          <View className="p-4 mt-8 rounded-lg ">
            <Text className="mb-4 text-xl font-nsemibold">Select Type</Text>
            <Picker
              selectedValue={form.type}
              onValueChange={(itemValue) =>
                setForm({ ...form, type: itemValue })
              }
              className="p-2 bg-gray-100 rounded-lg"
            >
              <Picker.Item label="International" value="International" />
              <Picker.Item label="Typical Food" value="TypicalFood" />
              <Picker.Item label="Fast Food" value="FastFood" />
              <Picker.Item label="BreakFast" value="BreakFast" />
              <Picker.Item label="CoffeBar" value="CoffeBar" />
              <Picker.Item label="CoffeRestaurant" value="CoffeRestaurant" />
              <Picker.Item label="Vegan" value="Vegan" />
            </Picker>
          </View>

          <CustomButtomRes
            title="Publish"
            handlePress={submit}
            containerStyles="mt-4"
            isLoading={uploading}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default Create;
