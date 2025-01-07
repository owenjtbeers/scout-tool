import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme, Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { userSlice } from "../../redux/user/userSlice";

// Get Current user data
import { useGetCurrentUserQuery } from "../../redux/user/userApi";
import { ActivityIndicator, View } from "react-native";
import { HOME_SETTINGS_SCREEN } from "../../navigation/screens";
export const ManageOrganization: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    refetch,
  } = useGetCurrentUserQuery("default", { refetchOnReconnect: true });

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push(HOME_SETTINGS_SCREEN);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ justifyContent: "flex-start", padding: 16 }}>
        <Button
          containerStyle={{ maxWidth: 200 }}
          radius={5}
          title={"Back"}
          onPress={handleBack}
        />
      </View>
      <ActivityIndicator
        animating={isLoadingUser}
        size="large"
        color="#0000ff"
      />
      <View style={{ rowGap: 10 }}>
        <Text h4 style={{ marginBottom: 8, marginLeft: 16 }}>
          Organization Name
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 16, color: "#666666" }}>
          {currentUser?.data?.Organization?.Name}
        </Text>

        <Text h4 style={{ marginBottom: 8, marginLeft: 16 }}>
          Current User
        </Text>
        <Text style={{ fontSize: 18, marginLeft: 16, color: "#666666" }}>
          {currentUser?.data?.FirstName + " " + currentUser?.data?.LastName}
        </Text>
      </View>
    </SafeAreaView>
  );
};
