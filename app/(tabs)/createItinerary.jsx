import React, { useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Alert,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { useGlobalContext } from "../../context/GlobalProvider";
import { createItinerary, searchRestaurantByName } from "../../lib/appwrite";

const CreateItinerary = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    visitDate: new Date(),
    numberOfPeople: "",
  });
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantId, setRestaurantId] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSearchRestaurant = async () => {
    if (!restaurantName.trim()) {
      return Alert.alert("Error", "Please enter a restaurant name");
    }

    try {
      const restaurant = await searchRestaurantByName(restaurantName);
      if (!restaurant) {
        return Alert.alert("Error", "Restaurant not found");
      }
      setRestaurantId(restaurant.$id);
      Alert.alert("Success", "Restaurant found successfully!");
    } catch (error) {
      Alert.alert("Error", error.message);
      setRestaurantId("");
    }
  };

  const submit = async () => {
    if (!restaurantId || !form.numberOfPeople || !form.visitDate) {
      return Alert.alert("Error", "Please fill in all required fields");
    }

    setUploading(true);
    try {
      await createItinerary(form, restaurantId, user.$id);
      Alert.alert("Success", "Itinerary created successfully");
      setForm({
        visitDate: new Date(),
        numberOfPeople: "",
      });
      setRestaurantName("");
      setRestaurantId("");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    const currentDate = selectedDate || form.visitDate;
    setShowDatePicker(false);
    setForm({ ...form, visitDate: currentDate });
  };

  return (
    <SafeAreaView className="h-full bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="flex justify-center w-full h-full px-4 my-6"
            style={{
              minHeight: Dimensions.get("window").height - 100,
            }}
          >
            <View className="flex-row items-center justify-center mb-6">
              <Text className="ml-3 text-2xl font-nsemibold ">
                Create your Itinerary
              </Text>
            </View>

            <FormField
              placeholder="Restaurant Name"
              value={restaurantName}
              handleChangeText={setRestaurantName}
              otherStyles="mt-7"
            />

            <CustomButton
              title="Search Restaurant"
              handlePress={handleSearchRestaurant}
              containerStyles="mt-4"
              isLoading={false}
            />

            {restaurantId && (
              <Text className="mt-4 text-lg text-gray-600 text-center">
                Restaurant found and selected
              </Text>
            )}

            <FormField
              placeholder="Number of People"
              value={form.numberOfPeople}
              handleChangeText={(e) => setForm({ ...form, numberOfPeople: e })}
              keyboardType="numeric"
              otherStyles="mt-7"
            />

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="w-full"
            >
              <FormField
                placeholder="Visit Date"
                value={form.visitDate.toLocaleDateString()}
                editable={false}
                otherStyles="mt-7"
              />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={form.visitDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}

            <CustomButton
              title="Save Itinerary"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={uploading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateItinerary;
