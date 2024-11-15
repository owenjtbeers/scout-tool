import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProductsPage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>About Us</Text>
      <Text style={styles.paragraph}>
        Welcome to our website! We are dedicated to providing the best service
        possible.
      </Text>
      <Text style={styles.paragraph}>
        Our team is composed of experienced professionals who are passionate
        about what they do.
      </Text>
      <Text style={styles.paragraph}>
        Stay tuned for more updates and information about our company.
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

export default ProductsPage;
