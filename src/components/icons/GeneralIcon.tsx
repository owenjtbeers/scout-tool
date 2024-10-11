import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import type { IconProps } from "./types";

export const GeneralIcon = (props: IconProps) => {
  const { theme } = useTheme();
  return (
    <MaterialCommunityIcons
      name="lightning-bolt"
      size={props?.size || 24}
      color={props?.color || theme.colors.primary}
    />
  );
};
