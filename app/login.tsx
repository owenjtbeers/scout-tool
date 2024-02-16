import React from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Href, useRouter } from "expo-router";
import { useLoginMutation } from "../src/redux/auth/authApi";
import { HOME_MAP_SCREEN } from "../src/navigation/screens";
import { userSlice } from "../src/redux/user/userSlice";


export default function Login() {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const onSubmit = async (formData: any) => {
    const gResponse = await fetch("http://www.sitemaps.org/schemas/sitemap/0.9/");
    const gData = await gResponse.json();
    console.log("data", gData);
    const response = await login({
      username: formData.username,
      password: formData.password,
    });
    if ("data" in response) {
      dispatch(userSlice.actions.setToken(response.data.token));
      router.push(HOME_MAP_SCREEN as Href<string>);
    } else {
      // TODO Display error message and handle this elegantly
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
            placeholder="Username"
          />
        )}
        name="username"
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
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
