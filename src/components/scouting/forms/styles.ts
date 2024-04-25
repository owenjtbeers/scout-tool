import { StyleSheet } from "react-native";

export const scoutFormStyles = StyleSheet.create({
  section: {
    padding: 10,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
  },
  page: {
    flex: 1,
    padding: 10,
    paddingTop: 25,
  },
  heading: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  floatingScoutButton: {
    padding: 5,
    position: "absolute",
    // bottom: 0,
    right: 0,
    // margin: 20,
    // width: 200,
    zIndex: 100,
  },
  largeTextInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
});
