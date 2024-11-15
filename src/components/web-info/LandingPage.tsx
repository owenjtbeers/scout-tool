import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text } from "@rneui/themed";
import { styles } from "./styles";

const LandingPage = () => {
  return (
    <View style={styles.centeredContainer}>
      <Text h2> Welcome to Grounded Agri-Tools!</Text>
      <Text style={styles.subtitle}>
        Your one-stop solution for scouting needs
      </Text>
      <Button title="Get Started" onPress={() => {}} />
    </View>
  );
};

export default LandingPage;
