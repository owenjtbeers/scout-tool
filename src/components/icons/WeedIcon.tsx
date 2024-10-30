import React from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { useTheme } from "@rneui/themed";
import type { IconProps } from "./types";

export const WeedIcon = (props: IconProps) => {
  const { theme } = useTheme();
  return (
    <FontAwesome6
      name="plant-wilt"
      size={props?.size || 24}
      color={props?.color || theme.colors.primary}
    />
  );
};
