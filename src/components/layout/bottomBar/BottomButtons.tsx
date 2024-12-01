import React from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

type IconProps = {
  focused: boolean;
  color: string;
};

export const MapTabIcon = (props: IconProps) => {
  return <Ionicons name="map" size={24} color={props.color} />;
};

export const FieldTabIcon = (props: IconProps) => {
  return (
    <MaterialCommunityIcons name="focus-field" size={24} color={props.color} />
  );
};

export const SettingsTabIcon = (props: IconProps) => {
  return <Ionicons name="settings" size={24} color={props.color} />;
};

export const FeedbackTabIcon = (props: IconProps) => {
  return <MaterialIcons name="feedback" size={24} color={props.color} />;
};
