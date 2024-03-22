import { createTheme } from "@rneui/themed";

export const colors = {
  // primary: "#6B818D", // Blue green
  primary: "#00342B", // Dark green
  secondary: "#d3f0db",
  tertiary: "#d3f0dbAA", // Light green with opacity???
  selectedFieldBoundaryFill: "#87CEFAAA", // Blue with opacity
};

export const theme = createTheme({
  lightColors: {
    primary: colors.primary,
    secondary: colors.secondary,
    // tertiary: colors.tertiary,
  },
  darkColors: {
    primary: colors.primary,
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
  },
});
