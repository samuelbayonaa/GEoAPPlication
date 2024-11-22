import React from "react";
import { View, KeyboardAvoidingView, Platform } from "react-native";
import { Stack } from "expo-router";
import tw from "tailwind-react-native-classnames";
import Map from "../../components/Map";
import { NavigateCard } from "../../components";

const MapScreen = () => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={tw`flex-1`}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>

      <View style={tw`flex-1`}>
        <View style={tw`h-1/2`}>
          <Map />
        </View>
        <View style={tw`h-1/2`}>
          <NavigateCard />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default MapScreen;
