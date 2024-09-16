import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import type { IconProps } from "./types";

export const DiseaseIcon = (props: IconProps) => {
  const { theme } = useTheme();
  return (
    <MaterialCommunityIcons
      name="bacteria"
      size={props?.size || 24}
      color={props?.color || theme.colors.primary}
    />
  );
};
