import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    // padding: 20,
    fontFamily: "Arial",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  twoChildContainerVertical: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  leftAlignedTextContainer: {
    flex: 1,
    marginLeft: 20,
    alignContent: "center",
    justifyContent: "center",
  },
  rightAlignedTextContainer: {
    flex: 1,
    marginRight: 20,
    alignContent: "center",
    justifyContent: "center",
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
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    paddingTop: 10,
    marginBottom: 20,
  },
  oddBackgroundColor: {
    backgroundColor: "whitesmoke",
  },
});
