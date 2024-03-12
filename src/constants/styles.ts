import { createTheme } from "@rneui/themed";

export const colors = {
  primary: "#6B818D", // Blue green
  primaryButton: "#6B818D",
};

export const theme = createTheme({
  lightColors: {
    primary: colors.primary,
  },
  darkColors: {
    primary: colors.primary,
  },
  mode: "light",
  components: {
    Button: {
      raised: true,
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
  },
});
