import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "@rneui/themed";
import { useRouter } from "expo-router";
import { LOGIN_SCREEN } from "../../navigation/screens";

const EmailVerificationSuccess: React.FC = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification Successful</Text>
      <Text style={styles.message}>
        Thank you for verifying your email address. Now please login to your
        account.
      </Text>
      <Button
        title="Go to Login"
        onPress={() => {
          router.navigate(LOGIN_SCREEN);
        }}
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
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
  },
});

export default EmailVerificationSuccess;
