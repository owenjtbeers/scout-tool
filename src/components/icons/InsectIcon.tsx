import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import type { IconProps } from "./types";

export const InsectIcon = (props: IconProps) => {
  const { theme } = useTheme();
  return (
    <MaterialIcons
      name="pest-control"
      size={props?.size || 24}
      color={props?.color || theme.colors.primary}
    />
  );
};
