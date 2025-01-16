import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button, CheckBox } from "@rneui/themed";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { Octicons, Entypo, MaterialIcons } from "@expo/vector-icons";
import { useSignupUserMutation } from "../../../src/redux/user/userApi";
import {
  HOME_MAP_SCREEN,
  LOGIN_SCREEN,
  VERIFICATION_EMAIL_PROMPT_SCREEN,
} from "../../../src/navigation/screens";
import { userSlice } from "../../../src/redux/user/userSlice";
import { Dialog } from "@rneui/themed";
import { getErrorMessage } from "../../utils/errors";
import { validation } from "../../forms/validationFunctions";
import { validationRules } from "../../forms/validationRules";
import { useTheme } from "@rneui/themed";
import EmailVerificationSuccess from "../verification/EmailVerificationSuccess";

interface FormData {
  email: string;
  password: string;
  organizationName: string;
  firstName: string;
  lastName: string;
}

export const Signup = () => {
  const dispatch = useDispatch();
  const [signupUser] = useSignupUserMutation();
  const theme = useTheme();
  const router = useRouter();
  const { control, handleSubmit } = useForm<FormData>();
  const [message, setMessage] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const onSubmit = async (formData: FormData) => {
    formData.email = formData.email.toLowerCase();
    const response = await signupUser(formData);
    const { data: responseData, error } = response;
    if (responseData) {
      router.push(VERIFICATION_EMAIL_PROMPT_SCREEN);
    } else if (error) {
      const errorMessage = getErrorMessage(response);
      setMessage(`Error Creating Account: ${errorMessage}`);
    }
  };

  return (
    <View style={styles.container}>
      <Link style={styles.link} href={LOGIN_SCREEN}>
        <Text>Already have an account? Login</Text>
      </Link>
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="First Name"
            textContentType="givenName"
            errorMessage={error?.message}
            leftIcon={
              <Octicons
                name="organization"
                size={24}
                color={theme.theme.colors.primary}
              />
            }
          />
        )}
        name="firstName"
        rules={validationRules.requiredAndMinMaxLength(2, 50)}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Last Name"
            textContentType="familyName"
            // autoCapitalize="none"
            errorMessage={error?.message}
            leftIcon={
              <Octicons
                name="organization"
                size={24}
                color={theme.theme.colors.primary}
              />
            }
          />
        )}
        name="lastName"
        rules={validationRules.requiredAndMinMaxLength(2, 50)}
        defaultValue=""
      />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Email"
            textContentType="emailAddress"
            autoCapitalize="none"
            errorMessage={error?.message}
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
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Password"
            textContentType="password"
            autoCapitalize="none"
            secureTextEntry={!showPassword}
            errorMessage={error?.message}
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
      <CheckBox
        title="show password"
        checked={showPassword}
        onPress={() => {
          setShowPassword(!showPassword);
        }}
      />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <Input
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Organization Name"
            errorMessage={error?.message}
            textContentType="organizationName"
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
