import React from "react";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

type IconProps = {
  focused: boolean;
  color: string;
  size?: number;
};

export const MapTabIcon = (props: IconProps) => {
  return <Ionicons name="map" size={props?.size || 24} color={props.color} />;
};

export const FieldTabIcon = (props: IconProps) => {
  return (
    <MaterialCommunityIcons name="focus-field" size={props?.size || 24} color={props.color} />
  );
};

export const SettingsTabIcon = (props: IconProps) => {
  return <Ionicons name="settings" size={props?.size || 24} color={props.color} />;
};

export const FeedbackTabIcon = (props: IconProps) => {
  return <MaterialIcons name="feedback" size={props?.size || 24} color={props.color} />;
};

export const FieldUploadTabIcon = (props: IconProps) => {
  return <MaterialIcons name="cloud-upload" size={props?.size || 24} color={props.color} />;
}