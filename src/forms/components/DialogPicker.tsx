import React, { useState } from "react";
import { Input, Dialog, InputProps, Text } from "@rneui/themed";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import { Entypo } from "@expo/vector-icons";

type Option = {
  label: string;
  value: string;
};

interface DialogPickerProps extends InputProps {
  options: Option[] | undefined;
  onAddNewOption?: (value: string) => void;
  dialogTitle?: string;
}

export const CustomInput = React.forwardRef(
  (props: DialogPickerProps, ref: React.Ref<any>) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [isAddingOption, setIsAddingOption] = useState(false);
    const [newOptionValue, setNewOptionValue] = useState("");
    const [error, setError] = useState("");
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
    const onAddOption = () => {
      setIsAddingOption(true);
    };
    const onCloseDialog = () => {
      setDialogVisible(false);
      setIsAddingOption(false);
      setNewOptionValue("");
      setError("");
    };
    return (
      <>
        <Input
          value={
            props.options?.find((opt) => opt.value === props.value)?.label || ""
          }
          rightIcon={
            <Pressable onPress={onPressIn}>
              <Entypo name="chevron-down" size={24} color="black" />
            </Pressable>
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
          onDismiss={onCloseDialog}
          onBackdropPress={onCloseDialog}
        >
          <ScrollView>
            {props?.dialogTitle && (
              <Dialog.Title>{props.dialogTitle}</Dialog.Title>
            )}
            {props.onAddNewOption && !isAddingOption && (
              <Pressable onPress={onAddOption}>
                <Text style={styles.dialogOption}>Add New Option</Text>
              </Pressable>
            )}
            {props.options &&
              !isAddingOption &&
              props.options.map((option, index) => (
                <Pressable key={index} onPress={() => onPressOption(option)}>
                  <Text style={styles.dialogOption}>{option.label}</Text>
                </Pressable>
              ))}
            {isAddingOption && props?.onAddNewOption && (
              <>
                <Input
                  label="New Option"
                  placeholder="Enter new option"
                  value={newOptionValue}
                  onChangeText={setNewOptionValue}
                  errorMessage={error}
                />
                <Dialog.Actions>
                  <Dialog.Button title="Cancel" onPress={onCloseDialog} />
                  <Dialog.Button
                    title="Add"
                    onPress={() => {
                      if (
                        props.options?.find(
                          (opt) => opt.value === newOptionValue
                        )
                      ) {
                        setError("Option already exists");
                        return;
                      }
                      if (props.onAddNewOption) {
                        props.onAddNewOption(newOptionValue);
                      }
                      onCloseDialog();
                    }}
                  />
                </Dialog.Actions>
              </>
            )}
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

export const DialogPickerSelect = (props: DialogPickerProps) => {
  // return <Input InputComponent={CustomInput} {...props} />;
  return <CustomInput {...props} />;
};
