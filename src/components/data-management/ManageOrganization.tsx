import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, useTheme, Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { userSlice } from "../../redux/user/userSlice";

// Get Current user data
import { useGetCurrentUserQuery } from "../../redux/user/userApi";
import { ActivityIndicator } from "react-native";
export const ManageOrganization: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { data: currentUser, isLoading: isLoadingUser, refetch } =
    useGetCurrentUserQuery("default", { refetchOnReconnect: true });

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView>
      <Button title={"Back"} onPress={handleBack} />
      <ActivityIndicator
        animating={isLoadingUser}
        size="large"
        color="#0000ff"
      />
      <Text h4>Organization Name: </Text>
      <Text>{currentUser?.data?.Organization?.Name}</Text>
      <Text h4>Current User: </Text>
      <Text>
        {currentUser?.data?.FirstName + " " + currentUser?.data?.LastName}
      </Text>
    </SafeAreaView>
  );
};
