import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ContactUsPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>COMING SOON</Text>
      <Text style={styles.paragraph}>
        We are not live quite yet, but if you need to get a hold of us. Send us
        an email at admin@groundedag.com !
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    fontFamily: "Arial",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ContactUsPage;
