import { StyleSheet } from "react-native";
import { createTheme } from "@rneui/themed";

export const DARK_GREEN_PRIMARY = "#00342B";
export const colors = {
  // primary: "#6B818D", // Blue green
  primary: DARK_GREEN_PRIMARY, // Dark green
  secondary: "#d3f0db",
  tertiary: "rgba(187, 239, 198, 0.4)",
  // tertiary: "#d3f0dbAA", // Light green with opacity???
  selectedFieldBoundaryFill: "#87CEFAAA", // Blue with opacity
};

export const theme = createTheme({
  lightColors: {
    primary: colors.primary,
    secondary: colors.secondary,
    grey0: "lightgray",
    // tertiary: colors.tertiary,
  },
  darkColors: {
    primary: colors.primary,
    grey0: "lightgray",
  },
  mode: "light",
  components: {
    Button: {
      raised: true,
      titleStyle: {
        color: colors.secondary,
      },
    },
    Dialog: {
      style: {
        backgroundColor: "lightgray",
      },
    },
    Input: {
      inputContainerStyle: {
        borderBottomWidth: 0,
      },
      inputStyle: {
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "gray",
        borderWidth: 1,
        borderStyle: "solid",
        padding: 10,
      },
    },
    Icon: {
      color: "black",
    },
    SearchBar: {
      inputStyle: {
        backgroundColor: "white",
      },
      inputContainerStyle: {
        backgroundColor: "white",
      },
      containerStyle: {
        backgroundColor: "lightgray",
      },
    },
  },
});

export const globalStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  flexCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centerText: {
    textAlign: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    height: 100,
    backgroundColor: colors.primary,
  },
});
