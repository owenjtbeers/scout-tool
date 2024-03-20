import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button } from "@rneui/themed";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Href, useRouter } from "expo-router";
import { Octicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useSignupUserMutation } from "../../../src/redux/user/userApi";
import { HOME_MAP_SCREEN } from "../../../src/navigation/screens";
import { userSlice } from "../../../src/redux/user/userSlice";
import { Dialog } from "@rneui/themed";
import { getErrorMessage } from "../../utils/errors";
import { validation } from "../../forms/validationFunctions";
import { validationRules } from "../../forms/validationRules";
import { useTheme } from "@rneui/themed";

export const Signup = () => {
  const dispatch = useDispatch();
  const [signupUser] = useSignupUserMutation();
  const theme = useTheme();
  const router = useRouter();
  const { control, handleSubmit } = useForm();
  const [message, setMessage] = React.useState<string | null>(null);

  const onSubmit = async (formData: any) => {
    const response = await signupUser({
      email: formData.email,
      password: formData.password,
      organizationName: formData.organizationName,
    });
    if ("data" in response) {
      dispatch(userSlice.actions.setToken(response.data.token));
      router.replace(HOME_MAP_SCREEN as Href<string>);
    } else if ("error" in response) {
      const errorMessage = getErrorMessage(response);
      setMessage(`Error Creating Account: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <Link style={styles.link} href="/login">
        <Text>Already have an account? Login</Text>
      </Link>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            leftIcon={
              <MaterialIcons
                name="email"
                size={24}
                color={theme.theme.colors.primary}
              />
            }
          />
        )}
        name="email"
        rules={{ required: true, validate: validation.isEmail }}
        defaultValue=""
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            secureTextEntry
            leftIcon={
              <Entypo
                name="lock"
                size={24}
                color={theme.theme.colors.primary}
              />
            }
          />
        )}
        name="password"
        rules={validationRules.requiredAndMinMaxLength(7, 50)}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Organization Name"
            leftIcon={
              <Octicons
                name="organization"
                size={24}
                color={theme.theme.colors.primary}
              />
            }
          />
        )}
        name="organizationName"
        rules={validationRules.requiredAndMinMaxLength(1, 100)}
        defaultValue=""
      />
      <Button title="Create Account" onPress={handleSubmit(onSubmit)} />
      <Dialog
        onBackdropPress={() => setMessage(null)}
        isVisible={!!message}
        onDismiss={() => {
          router.replace("/login");
          setMessage(null);
        }}
      >
        <Text>{message}</Text>
      </Dialog>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  link: {
    marginTop: 20,
    marginBottom: 20,
    textDecorationLine: "underline",
    color: "blue",
  },
});
