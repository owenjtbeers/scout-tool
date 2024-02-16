import React from "react";
import { StyleSheet, Text, StyleProp, ViewStyle } from "react-native";

type ErrorMessageProps = {
  message: string | undefined;
  style?: React.CSSProperties;
};
export const ErrorMessage: React.FC<ErrorMessageProps> = (props) => {
  const errorStyle = props.style
    ? { ...styles.error, ...props.style }
    : styles.error;
  // @ts-ignore this error is BS, avoiding for now TODO Don't avoid this and fix it
  return <Text style={errorStyle}>{props.message}</Text>;
};

const styles = StyleSheet.create({
  error: {
    color: "red",
    fontStyle: "italic"
  },
});
