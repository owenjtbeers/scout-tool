import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { LOGIN_SCREEN } from "../../navigation/screens";

const EmailVerificationError: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification Error</Text>
      <Text style={styles.message}>
        Error verifying your account. This can happen for a few reasons, contact
        your administrator for help. Or reset your password to get another email link.
      </Text>
      <Button
        title="Go to Login"
        onPress={() => {
          router.navigate(LOGIN_SCREEN);
        }}
        buttonStyle={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "red",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#2089dc",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default EmailVerificationError;
