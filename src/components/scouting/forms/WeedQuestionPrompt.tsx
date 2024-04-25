import React, { useState } from "react";
import { Button, Text, Dialog, ListItem } from "@rneui/themed";
import { View, StyleSheet } from "react-native";
import { scoutFormStyles } from "./styles";
import { globalStyles } from "../../../constants/styles";


const WeedQuestionPrompt = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleYesClick = () => {
    setShowDialog(true);
  };

  const handleNoClick = () => {
    setIsAnswered(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  return (
    <View style={scoutFormStyles.section}>
      <Text style={globalStyles.centerText}>Is there Weeds?</Text>
      <View style={styles.buttonContainer}>
        <Button title="Yes" onPress={handleYesClick} />
        <Button title="No" onPress={handleNoClick} />
      </View>

      {showDialog && (
        <Dialog isVisible={showDialog} onDismiss={handleDialogClose}>
          <Dialog.Title>This is the dialog title</Dialog.Title>
          <ListItem>
            <Text>Weed 1</Text>
          </ListItem>
          <Button title="Close" onPress={handleDialogClose} />
        </Dialog>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});

export default WeedQuestionPrompt;
