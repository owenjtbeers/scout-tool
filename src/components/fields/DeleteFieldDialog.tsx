import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Dialog, useTheme, Button } from "@rneui/themed";
import { useSelector } from "react-redux";
import { GLOBAL_SELECTIONS_REDUCER_KEY } from "../../redux/globalSelections/globalSelectionsSlice";
import { RootState } from "../../redux/store";
import { useDeleteFieldMutation } from "../../redux/fields/fieldsApi";
import { set } from "react-hook-form";

interface DeleteFieldDialogProps {
  onClose: () => void;
}

export const DeleteFieldDialog = (props: DeleteFieldDialogProps) => {
  const { theme } = useTheme();
  const [deleteField, deleteFieldResult] = useDeleteFieldMutation();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );
  const selectedGrower = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].grower
  );
  const onDeleteField = async () => {
    if (selectedField) {
      const result = await deleteField({ fieldId: selectedField.ID });
      if (!result.error) {
        props.onClose();
      } else if (result.error) {
        const error = result.error;
        const errMsg = "error" in error ? error.error : error.data.error;
        setErrorMessage(`Error deleting field${errMsg ? ": " + errMsg : ""}`);
        console.error(result.error);
      }
    }
  };

  return (
    <Dialog isVisible={true} onBackdropPress={props.onClose}>
      <Dialog.Title title={"Delete Field"} />
      {!errorMessage && (
        <>
          <Text>
            Are you sure you want to delete the field: "{selectedField?.Name}"?
          </Text>
          {!deleteFieldResult.isLoading && (
            <View style={{ gap: 10 }}>
              <Text>{`For Grower: "${selectedGrower?.Name}"`}</Text>
              <Text style={{ color: theme.colors.error }}>
                This action cannot be undone. If there is associated data with
                the field i.e. scouting reports, this will result in an error.
              </Text>
              <Dialog.Actions>
                <View style={{ gap: 10, flexDirection: "row" }}>
                  <Button
                    title="Delete"
                    onPress={onDeleteField}
                    color={"primary"}
                  />
                  <Button
                    title="Cancel"
                    onPress={props.onClose}
                    color={"error"}
                  />
                </View>
              </Dialog.Actions>
            </View>
          )}
          {deleteFieldResult.isLoading && (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          )}
        </>
      )}
      {errorMessage && <Text>{errorMessage}</Text>}
    </Dialog>
  );
};

export default DeleteFieldDialog;
