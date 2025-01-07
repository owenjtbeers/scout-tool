import React from "react";
import {
  View,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button, Input, Text } from "@rneui/themed";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useRouter } from "expo-router";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useLoginMutation } from "../../../src/redux/auth/authApi";
import {
  HOME_MAP_SCREEN,
  SIGNUP_SCREEN,
} from "../../../src/navigation/screens";
import { userSlice } from "../../../src/redux/user/userSlice";
import { Dialog, useTheme } from "@rneui/themed";
import { getErrorMessage } from "../../utils/errors";
import { keyboardBehavior } from "../../utils/formatting/keyboardBehavior";

export const Login = () => {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const theme = useTheme();
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
      dispatch(userSlice.actions.setCurrentUser(response.data.user));
      // TODO: Actually set the user in state as well
      router.replace(HOME_MAP_SCREEN);
    } else if ("error" in response) {
      const errorMessage = getErrorMessage(response);
      setError(errorMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={keyboardBehavior()}
      style={styles.container}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("../../../assets/icon.png")}
          style={styles.logo}
        />
        <Text
          style={{
            position: "absolute",
            fontSize: 70,
            fontWeight: "bold",
            color: "red",
            transform: "rotate(30deg)",
          }}
        >
          BETA
        </Text>
      </View>
      <View style={styles.inputsContainer}>
        <Controller
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <Input
              // style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Email"
              autoCapitalize="none"
              leftIcon={
                <MaterialIcons
                  name="email"
                  size={24}
                  color={theme.theme.colors.primary}
                />
              }
              errorMessage={error?.message}
            />
          )}
          name="email"
          rules={{ required: true }}
          defaultValue=""
        />
        <Controller
          control={control}
          render={({
            field: { onChange, onBlur, value },
            fieldState: { error },
          }) => (
            <Input
              // style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              autoCapitalize="none"
              leftIcon={
                <Entypo
                  name="lock"
                  size={24}
                  color={theme.theme.colors.primary}
                />
              }
              errorMessage={error?.message}
              secureTextEntry
            />
          )}
          name="password"
          rules={{ required: true }}
          defaultValue=""
        />

        <Button title="Login" onPress={handleSubmit(onSubmit)} />
      </View>
      {Platform.OS !== "web" && (
        <Link style={styles.link} href={SIGNUP_SCREEN}>
          Don't have an account? Sign up here
        </Link>
      )}
      <Dialog
        onBackdropPress={() => setError(null)}
        isVisible={!!error}
        onDismiss={() => setError(null)}
      >
        <Text>{`Error Logging in:\n${error}\nPlease try again`}</Text>
      </Dialog>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F2F2F2",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxWidth: 500,
  },
  // input: {
  //   width: "100%",
  //   height: 40,
  //   borderColor: "gray",
  //   borderWidth: 1,
  //   marginBottom: 12,
  //   paddingHorizontal: 8,
  // },
  link: {
    marginTop: 20,
    textDecorationLine: "underline",
    color: "blue",
  },
  logo: {
    width: 200,
    height: 200,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
