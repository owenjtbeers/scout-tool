import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Dialog, Input } from "@rneui/themed";
import { useRouter } from "expo-router";
import { LOGIN_SCREEN } from "../../navigation/screens";
import { Controller, set, useForm } from "react-hook-form";
import { useResendVerificationEmailMutation } from "../../redux/auth/authApi";

const EmailVerificationSuccess: React.FC = () => {
  const router = useRouter();
  const [isResendEmailFormVisible, setIsResendEmailFormVisible] =
    React.useState(false);
  const [isResendEmailButtonActive, setIsResendEmailButtonActive] =
    React.useState(true);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email Verification Pending</Text>
      <Text style={styles.message}>
        Please go to your email and click the link to verify your account.
      </Text>
      <Button style={styles.button} onPress={() => router.push(LOGIN_SCREEN)}>
        Go to Login
      </Button>
      <Button
        style={styles.button}
        onPress={() => {
          setIsResendEmailFormVisible(true);
        }}
        disabled={!isResendEmailButtonActive}
      >
        Resend Verification Email
      </Button>
      <ResendEmailForm
        isVisible={isResendEmailFormVisible}
        onSubmit={(data) => {
          setIsResendEmailButtonActive(false);
          setTimeout(() => {
            setIsResendEmailButtonActive(true);
          }, 15000);
          setIsResendEmailFormVisible(false);
        }}
        onCancel={() => {
          setIsResendEmailFormVisible(false);
        }}
      />
    </View>
  );
};

interface ResendEmailFormProps {
  isVisible: boolean;
  onSubmit: (data: EmailForm) => void;
  onCancel: () => void;
}
interface EmailForm {
  email: string;
}
const ResendEmailForm = (props: ResendEmailFormProps) => {
  const [resendVerificationEmail] = useResendVerificationEmailMutation();
  const [message, setMessage] = React.useState<string | null>(null);
  const defaultValues = {
    email: "",
  };
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { isDirty, isValid, isSubmitSuccessful },
    reset,
    watch,
  } = useForm<EmailForm>({ defaultValues });
  const onSubmit = async (data: EmailForm) => {
    const response = await resendVerificationEmail(data.email);
    if (response && response.data) {
      setMessage("Email sent successfully");
    }
    props.onSubmit(data);
  };
  return (
    <Dialog
      isVisible={props.isVisible}
      onDismiss={props.onCancel}
      onBackdropPress={props.onCancel}
    >
      <View>
        {message && <Text style={styles.title}>{message}</Text>}
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
              errorMessage={error?.message}
            />
          )}
          name="email"
          rules={{ required: "Email is required" }}
        />
        <Button onPress={handleSubmit(onSubmit)}>
          Resend Verification Email
        </Button>
      </View>
    </Dialog>
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
  button: {
    // backgroundColor: "#2089dc",
    // paddingHorizontal: 20,
    // paddingVertical: 10,
  },
});

export default EmailVerificationSuccess;
