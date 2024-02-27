import React from "react";
import Constants from "expo-constants";
import axios from "axios";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Href, useRouter } from "expo-router";
import { useLoginMutation } from "../../../src/redux/auth/authApi";
import { HOME_MAP_SCREEN } from "../../../src/navigation/screens";
import { userSlice } from "../../../src/redux/user/userSlice";
import { Dialog } from "@rneui/themed";
import { getErrorMessage } from "../../utils/errors";

export const Login = () => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const router = useRouter();
  const { control, handleSubmit } = useForm();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (formData: any) => {
    const response = await login({
      email: formData.email,
      password: formData.password,
    });
    if ("data" in response) {
      dispatch(userSlice.actions.setToken(response.data.token));
      router.replace(HOME_MAP_SCREEN as Href<string>);
    } else if ("error" in response) {
      const errorMessage = getErrorMessage(response);
      setError(errorMessage)
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
          />
        )}
        name="email"
        rules={{ required: true }}
        defaultValue=""
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            secureTextEntry
          />
        )}
        name="password"
        rules={{ required: true }}
        defaultValue=""
      />

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <Dialog onBackdropPress={() => setError(null)} isVisible={!!error} onDismiss={() => setError(null)}>
        <Text>{`Error Logging in:\n${error}\nPlease try again`}</Text>
      </Dialog>
    </View>
  );
};

const ErrorModal = () => {

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
