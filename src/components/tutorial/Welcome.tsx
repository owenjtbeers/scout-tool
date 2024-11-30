import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Button, Text } from "@rneui/themed";
import { useRouter } from "expo-router";
import { navigateToNextPhaseOfTutorial } from "./navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { set } from "react-hook-form";
import { setHasDismissedWelcomeScreen } from "../../redux/user/userSlice";

export const Welcome = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const welcomeFadeAnim = useRef(new Animated.Value(0)).current;
  const welcomeSlideAnim = useRef(new Animated.Value(50)).current;
  const setupFadeAnim = useRef(new Animated.Value(0)).current;
  const setupSlideAnim = useRef(new Animated.Value(50)).current;
  const router = useRouter();
  useEffect(() => {
    // Welcome message animation sequence
    const welcomeAnimation = Animated.parallel([
      Animated.timing(welcomeFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(welcomeSlideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    const welcomeFadeOut = Animated.timing(welcomeFadeAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    });

    // Setup message animation sequence
    const setupAnimation = Animated.parallel([
      Animated.timing(setupFadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(setupSlideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]);

    // Run the animation sequence
    Animated.sequence([
      welcomeAnimation,
      Animated.delay(2000), // Show welcome message for 2 seconds
      welcomeFadeOut,
      Animated.delay(500), // Small delay between messages
      setupAnimation,
      Animated.delay(3000), // Show setup message for 3 seconds
      // Animated.timing(setupFadeAnim, {
      //   toValue: 0,
      //   duration: 1000,
      //   useNativeDriver: true,
      // }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: welcomeFadeAnim,
            transform: [{ translateY: welcomeSlideAnim }],
          },
        ]}
      >
        <Text h1 style={styles.title}>
          Welcome to
        </Text>
        <Text h1 style={styles.brandName}>
          Grounded Agri-Tools
        </Text>
      </Animated.View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: setupFadeAnim,
            transform: [{ translateY: setupSlideAnim }],
          },
        ]}
      >
        <Text h2 style={styles.setupText}>
          Let's start by setting up some data
        </Text>
        <Text h2 style={styles.setupText}>
          that is relevant to you
        </Text>
        <Button
          containerStyle={{ margin: 10 }}
          title={"Continue"}
          onPress={() => {
            dispatch(setHasDismissedWelcomeScreen(true));
            navigateToNextPhaseOfTutorial(router, currentUser.Organization);
          }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1000,
  },
  content: {
    alignItems: "center",
    position: "absolute",
  },
  title: {
    color: "#333",
    marginBottom: 10,
  },
  brandName: {
    color: "#2E7D32",
    fontWeight: "bold",
  },
  setupText: {
    color: "#333",
    textAlign: "center",
    marginHorizontal: 20,
  },
});
