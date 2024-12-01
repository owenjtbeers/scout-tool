import React from "react";
import { Input, AirbnbRating, useTheme, Text, Button } from "@rneui/themed";
import { useForm, Controller } from "react-hook-form";
import { View, ScrollView, Platform, InputAccessoryView } from "react-native";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { usePostUserFeedbackMutation } from "../../redux/user/userApi";
import alert from "../polyfill/Alert";
import { useRouter } from "expo-router";
import { HOME_MAP_SCREEN } from "../../navigation/screens";

interface FeedbackForm {
  email: string;
  rating: number | null;
  comments: string;
}

export const FeedbackCenter = () => {
  const { theme } = useTheme();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const { handleSubmit, control } = useForm<FeedbackForm>({
    defaultValues: {
      email: currentUser.Email,
      rating: null,
      comments: "",
    },
  });
  const [postUserFeedback] = usePostUserFeedbackMutation();
  const router = useRouter();
  return (
    <ScrollView style={{ flex: 1, rowGap: 10, columnGap: 10 }}>
      <Text h3 style={{ padding: 10 }}>
        Feedback Form
      </Text>
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value, name },
          fieldState: { error },
        }) => (
          <>
            <Input
              placeholder="Email"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              label="* Email"
              labelStyle={{ color: "gray" }}
              errorMessage={error?.message}
              inputAccessoryViewID={name}
            />
            {Platform.OS === "ios" && (
              <InputAccessoryView nativeID={name}>
                <Input
                  label="* Email"
                  labelStyle={{ color: "gray" }}
                  placeholder="Enter Email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={error?.message}
                />
              </InputAccessoryView>
            )}
          </>
        )}
        name="email"
        rules={{
          required: "Some comments are required",
          minLength: {
            value: 2,
            message: "Must be at least two characters long",
          },
        }}
      />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <>
            <Text
              style={{
                color: "gray",
                fontWeight: "bold",
                paddingLeft: 10,
                fontSize: 16,
              }}
            >
              * Rating
            </Text>
            <AirbnbRating
              showRating
              reviewColor="gray"
              reviews={[
                "Needs a lot of work",
                "Needs Work",
                "Okay",
                "Good",
                "Great",
              ]}
              starContainerStyle={{
                borderWidth: 1,
                borderColor: "black",
                backgroundColor: "white",
                padding: 5,
              }}
              size={50}
              onFinishRating={onChange}
            />
          </>
        )}
        name="rating"
      />
      <Controller
        control={control}
        render={({
          field: { onChange, onBlur, value, name },
          fieldState: { error },
        }) => (
          <>
            <Input
              placeholder="Enter Comments"
              onBlur={onBlur}
              containerStyle={{ paddingVertical: 10 }}
              onChangeText={onChange}
              value={value}
              label="* Enter your Feedback here"
              multiline
              labelStyle={{ color: "gray" }}
              errorMessage={error?.message}
              inputAccessoryViewID={name}
            />
            {Platform.OS === "ios" && (
              <InputAccessoryView nativeID={name}>
                <Input
                  label="Enter your Feedback here"
                  labelStyle={{ color: "gray" }}
                  placeholder="Enter Comments"
                  value={value}
                  multiline
                  onChangeText={onChange}
                  onBlur={onBlur}
                  errorMessage={error?.message}
                />
              </InputAccessoryView>
            )}
          </>
        )}
        name="comments"
        rules={{
          required: "Some comments are required",
          minLength: {
            value: 2,
            message: "Must be at least two characters long",
          },
        }}
      />
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button
          title={"Submit"}
          containerStyle={{ minWidth: 200 }}
          radius={10}
          onPress={handleSubmit(async (data) => {
            const response = await postUserFeedback(data);
            // Take the user away on success
            if (response.data) {
              alert(
                "Your Feedback has been successfully received!",
                "Thank you for helping to make the app experience better"
              );
              router.push(HOME_MAP_SCREEN);
            } else {
              alert("Error: Feedback NOT received", "Please try again later");
            }
          })}
        />
      </View>
    </ScrollView>
  );
};
