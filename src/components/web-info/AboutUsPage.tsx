import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Image, Text } from "@rneui/themed";
import { styles } from "./styles";

const AboutUsPage: React.FC = () => {
  return (
    <ScrollView>
      <View
        id={"image-text-container-vertical"}
        style={styles.twoChildContainerVertical}
      >
        <Image
          source={require("../../../assets/icon.png")}
          style={{ width: 200, height: 200 }}
        />
        <View
          id={"mission-vision-text"}
          style={styles.leftAlignedTextContainer}
        >
          <Text h4 style={styles.header}>
            Vision
          </Text>
          <Text style={styles.paragraph}>
            Creating simple solutions for the world of agriculture
          </Text>
          <Text h4 style={styles.header}>
            Mission
          </Text>
          <Text style={styles.paragraph}>
            To develop and maintain digital tools designed and tested by
            agronomic professionals and their stakeholders, to meet the needs of
            the evolving agricultural industry.
          </Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.oddBackgroundColor} id={"founders-section-odd"}>
        <Text h4>Our Founders</Text>
        <View style={styles.twoChildContainerVertical}>
          <View style={styles.rightAlignedTextContainer}>
            <Text h4 style={styles.header}>
              Laine, Stephen, Owen
            </Text>
          </View>
          <Image
            source={require("../../../assets/icon.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
        <View style={styles.divider} />
      </View>
      <View id={"even-background-color-stephen"}>
        <View
          id={"image-text-container-vertical"}
          style={styles.twoChildContainerVertical}
        >
          <Image
            source={require("../../../assets/icon.png")}
            style={{ width: 200, height: 200 }}
          />
          <View
            id={"mission-vision-text"}
            style={styles.leftAlignedTextContainer}
          >
            <Text h4 style={styles.header}>
              Stephen
            </Text>
            <Text style={styles.paragraph}>
              Pretty good guy, likes to do Agronomy
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.oddBackgroundColor} id={"odd-background-color-laine"}>
        <View
          id={"image-text-container-vertical"}
          style={styles.twoChildContainerVertical}
        >
          <View
            id={"mission-vision-text"}
            style={styles.leftAlignedTextContainer}
          >
            <Text h4 style={styles.header}>
              Laine
            </Text>
            <Text style={styles.paragraph}>
              Pretty good guy, also likes to do Agronomy
            </Text>
          </View>
          <Image
            source={require("../../../assets/icon.png")}
            style={{ width: 200, height: 200 }}
          />
        </View>
        <View style={styles.divider} />
      </View>
      <View id="even-background-color-owen">
        <View
          id={"image-text-container-vertical"}
          style={styles.twoChildContainerVertical}
        >
          <Image
            source={require("../../../assets/icon.png")}
            style={{ width: 200, height: 200 }}
          />
          <View
            id={"mission-vision-text"}
            style={styles.leftAlignedTextContainer}
          >
            <Text h4 style={styles.header}>
              Owen
            </Text>
            <Text style={styles.paragraph}>
              Pretty good guy, likes to do Code and stuff
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
      </View>
      <Text h4 style={styles.header}>
        COMING SOON
      </Text>
      <Text style={styles.paragraph}>
        Stay tuned for more updates and information about our company.
      </Text>
    </ScrollView>
  );
};

export default AboutUsPage;
