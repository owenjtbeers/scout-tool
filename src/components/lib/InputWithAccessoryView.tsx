import React from "react";

import { Input, InputProps, Button, useTheme, SearchBar, SearchBarIosProps } from "@rneui/themed";
import { InputAccessoryView, StyleSheet, Platform, TouchableOpacity, View, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface InputWithAccessoryViewProps extends InputProps {
  // Make this field required
  inputAccessoryViewID: string;
}

const SaveAndCloseButton = (props: { onPress: () => void }) => {
  const { theme } = useTheme();
  return (
    <View style={style.closeButton}>
      <Button radius={10} title={"SAVE AND CLOSE"} color={"secondary"} titleStyle={{ color: theme.colors.primary }} onPress={props.onPress} />
    </View>
  );
}
export const InputWithAccessoryView = (props: InputWithAccessoryViewProps) => {
  return <>
    <Input {...props} />
    {Platform.OS === "ios" &&
      <InputAccessoryView nativeID={props.inputAccessoryViewID}>
        <SafeAreaView style={style.container}>
          <TouchableOpacity style={style.inputAccessoryViewBackground}>
            <SaveAndCloseButton onPress={() => { Keyboard.dismiss() }} />
            <Input
              {...props}
              inputStyle={style.inputAccessoryTextInput}
              inputContainerStyle={style.inputContainerStyle}
              labelStyle={style.inputAccessoryLabel}
              scrollEnabled={true}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </InputAccessoryView>}
  </>
};

interface SearchWithAccessoryViewProps extends SearchBarIosProps {
  // Make this field required
  inputAccessoryViewID: string;
}
export const SearchWithAccessoryView = (props: InputWithAccessoryViewProps) => {
  return <>
    <SearchBar
      {...props}
    />
    {Platform.OS === "ios" && (
      <InputAccessoryView nativeID={"search"}>
        <SafeAreaView style={style.container}>
          <TouchableOpacity style={style.inputAccessoryViewBackground}>
            <SaveAndCloseButton onPress={() => { Keyboard.dismiss() }} />
            <Input
              value={props.value}
              onChangeText={props.onChangeText}
              placeholder={props?.placeholder}
              inputStyle={style.inputAccessoryTextInput}
              inputContainerStyle={style.inputContainerStyle}
              labelStyle={style.inputAccessoryLabel}
              scrollEnabled={true}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </InputAccessoryView>
    )}
  </>
};
const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputAccessoryViewBackground: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Darkens the rest of the screen
    width: "100%",
    // width: "100%",
    // overflow: "hidden",
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Darkens the rest of the screen
  },
  inputContainerStyle: {
    width: "65%",
  },
  inputAccessoryTextInput: {
    textAlignVertical: "top",
    maxHeight: 225,
    width: "50%",
  },
  inputAccessoryLabel: {
    color: "white",
  },
  closeButton: {
    padding: 10,
  }
});