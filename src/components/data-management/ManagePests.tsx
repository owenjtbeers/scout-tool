import React from "react";
import { View, FlatList } from "react-native";
import { Button, useTheme } from "@rneui/themed";
import { useRouter } from "expo-router";
import {
  SETTINGS_MANAGE_WEEDS_SCREEN,
  SETTINGS_MANAGE_INSECTS_SCREEN,
  SETTINGS_MANAGE_DISEASES_SCREEN,
  HOME_SETTINGS_SCREEN,
} from "../../navigation/screens";
import { WeedIcon, DiseaseIcon, InsectIcon } from "../icons/Icons";

const ManagePests: React.FC = () => {
  const { theme } = useTheme();
  const router = useRouter();

  const buttonData = [
    {
      title: "Back",
      onPress: () => router.navigate(HOME_SETTINGS_SCREEN),
      buttonStyle: { backgroundColor: theme.colors.primary },
      disabled: false,
    },
    {
      title: "Manage Weeds",
      onPress: () => router.push(SETTINGS_MANAGE_WEEDS_SCREEN),
      icon: <WeedIcon color={theme.colors.secondary} />,
      disabled: true,
    },
    {
      title: "Manage Diseases",
      onPress: () => router.push(SETTINGS_MANAGE_DISEASES_SCREEN),
      icon: <DiseaseIcon color={theme.colors.secondary} />,
      disabled: true,
    },
    {
      title: "Manage Insects",
      onPress: () => router.push(SETTINGS_MANAGE_INSECTS_SCREEN),
      buttonStyle: { backgroundColor: theme.colors.primary },
      icon: <InsectIcon color={theme.colors.secondary} />,
      disabled: true,
    },
  ];
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <FlatList
        data={buttonData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Button
            onPress={item.onPress}
            style={item.buttonStyle}
            icon={item.icon}
            disabled={item.disabled}
          >
            {item.title}
          </Button>
        )}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 50,
        }}
      />
    </View>
  );
};

export default ManagePests;
