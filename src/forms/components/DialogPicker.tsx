import React, { useState } from "react";
import { Input, Dialog, InputProps, Text } from "@rneui/themed";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Entypo } from "@expo/vector-icons";

type Option = {
  label: string;
  value: string;
};

interface DialogPickerProps extends InputProps {
  options: Option[] | undefined;
  dialogTitle?: string;
}

export const CustomInput = React.forwardRef(
  (props: DialogPickerProps, ref: React.Ref<any>) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const { onChangeText } = props;
    const onPressIn = () => {
      setDialogVisible(true);
    };
    const onPressOption = (option: Option) => {
      if (onChangeText) {
        onChangeText(option.value);
        setDialogVisible(false);
      }
    };
    return (
      <>
        <Input
          value={
            props.options?.find((opt) => opt.value === props.value)?.label || ""
          }
          rightIcon={
            <TouchableOpacity onPress={onPressIn}>
              <Entypo name="chevron-down" size={24} color="black" />
            </TouchableOpacity>
          }
          onPressIn={onPressIn}
          ref={ref}
          inputMode="none"
          focusable={false}
          cursorColor={"transparent"}
          label={props.label}
          errorMessage={props.errorMessage}
        />
        <Dialog
          isVisible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          onBackdropPress={() => setDialogVisible(false)}
        >
          <ScrollView>
            {props?.dialogTitle && (
              <Dialog.Title>{props.dialogTitle}</Dialog.Title>
            )}
            {props.options &&
              props.options.map((option, index) => (
                <Pressable key={index} onPress={() => onPressOption(option)}>
                  <Text style={styles.dialogOption}>{option.label}</Text>
                </Pressable>
              ))}
          </ScrollView>
        </Dialog>
      </>
    );
  }
);

const styles = StyleSheet.create({
  dialogOption: {
    fontSize: 20,
    padding: 10,
  },
});

export const CustomDialogPicker = (props: DialogPickerProps) => {
  return <Input InputComponent={CustomInput} {...props} />;
};
