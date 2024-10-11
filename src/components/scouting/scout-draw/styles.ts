import { StyleSheet } from "react-native";

export const scoutDrawStyles = StyleSheet.create({
  buttonsContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 10,
  },
  drawingButtonsContainer: {
    flexDirection: "row",
    height: 70,
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    zIndex: 10,
    // left: 0,
    right: 10,
    top: 0, // Set bottom to 0 to align at the bottom
    marginLeft: "auto",
    marginRight: "auto",
  },
  colorButtonsContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-around",
    minWidth: "50%",
    maxWidth: "85%",
    // height: 70,
    backgroundColor: "lightgray",
    // left: 0,
    right: 10,
    marginRight: "auto",
    bottom: 0, // Keep it at the bottom
    position: "absolute",
    zIndex: 10,
    padding: 5,
    borderRadius: 10,
  },
  colorButton: {
    height: 50,
    width: 50,
  },
  pointOfInterestButtonContainer: {
    maxWidth: 100,
    maxHeight: 60,
    height: 60,
  },
  button: {
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "space-around",
    padding: 5,
  },
});
