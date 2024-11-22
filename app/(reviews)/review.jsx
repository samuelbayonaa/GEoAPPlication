import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";
import { createReview } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";

const Review = () => {
  const { restaurantId } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const [form, setForm] = useState({
    ratingPlace: "",
    ratingDish: "",
    ratingService: "",
    writeReview: "",
    recommendation: "",
  });

  const submitReview = async () => {
    if (
      !form.ratingPlace ||
      !form.ratingDish ||
      !form.ratingService ||
      !form.writeReview ||
      !form.recommendation
    ) {
      return Alert.alert("Error", "Por favor completa todos los campos");
    }

    try {
      await createReview(form, restaurantId, user.$id);
      Alert.alert("Good", "Review Send!");
      router.push({
        pathname: "/home",
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    }
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
              <Text className="ml-3 text-2xl font-nsemibold">
                We need your opinion!
              </Text>
            </View>

            <FormField
              value={form.ratingPlace}
              handleChangeText={(value) =>
                setForm({ ...form, ratingPlace: value })
              }
              otherStyles="mt-7"
              placeholder="Rate the place: 1 to 5"
              keyboardType="numeric"
            />
            <FormField
              value={form.ratingDish}
              handleChangeText={(value) =>
                setForm({ ...form, ratingDish: value })
              }
              otherStyles="mt-7"
              placeholder="Rate the dish: 1 to 5"
              keyboardType="numeric"
            />
            <FormField
              value={form.ratingService}
              handleChangeText={(value) =>
                setForm({ ...form, ratingService: value })
              }
              otherStyles="mt-7"
              placeholder="Rate the service 1 to 5"
              keyboardType="numeric"
            />
            <FormField
              value={form.writeReview}
              handleChangeText={(value) =>
                setForm({ ...form, writeReview: value })
              }
              otherStyles="mt-7"
              placeholder="Write a review"
              multiline
            />

            <View className="mt-7">
              <Text className="mb-2 text-lg font-nsemibold">
                Recommendation
              </Text>
              <Picker
                selectedValue={form.recommendation}
                onValueChange={(value) =>
                  setForm({ ...form, recommendation: value })
                }
                style={{ backgroundColor: "#f5f5f5", borderRadius: 8 }}
              >
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
            </View>

            <CustomButton
              title="Submit Review"
              handlePress={submitReview}
              containerStyles="mt-7"
              isLoading={false}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Review;
