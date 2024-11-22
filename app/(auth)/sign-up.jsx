import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker, PickerIOS } from "@react-native-picker/picker";
import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const submit = async () => {
    if (
      form.username === "" ||
      form.email === "" ||
      form.password === "" ||
      form.role === ""
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      const result = await createUser(
        form.email,
        form.password,
        form.username,
        form.role
      );

      setUser(result);
      setIsLogged(true);

      if (result.role === "OwnerofRestaurant") {
        router.replace("/homeRestaurant");
      } else {
        router.replace("/home");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
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
            <View className="flex-row items-center justify-center">
              <Text className="ml-4 text-2xl font-nsemibold">
                Sign Up to continue
              </Text>
              <Image
                source={images.logo}
                resizeMode="contain"
                className="w-[80px] h-[80px]"
              />
            </View>

            <FormField
              value={form.username}
              handleChangeText={(e) => setForm({ ...form, username: e })}
              otherStyles="mt-10"
              placeholder="Username"
            />

            <FormField
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              keyboardType="email-address"
              placeholder="Email"
            />

            <FormField
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles="mt-7"
              placeholder="Password"
            />

            <View className="p-4 mt-8 rounded-lg ">
              <Text className="mb-4 text-xl font-nsemibold">Select Role</Text>
              <Picker
                selectedValue={form.role}
                onValueChange={(itemValue) =>
                  setForm({ ...form, role: itemValue })
                }
                className="p-2 bg-gray-100 rounded-lg"
              >
                <Picker.Item label="Tourist" value="Tourist" />
                <Picker.Item
                  label="Restaurant Owner"
                  value="OwnerofRestaurant"
                />
              </Picker>
            </View>

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7"
              isLoading={isSubmitting}
            />

            <View className="flex flex-row justify-center gap-2 pt-5">
              <Text className="text-lg text-black font-nregular">
                Have an account already?
              </Text>
              <Link
                href="/sign-in"
                className="text-lg font-nsemibold text-sky-400"
              >
                Sign In
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
