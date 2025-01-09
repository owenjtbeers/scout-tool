import React from "react";
import { View, StyleSheet } from "react-native";

// Components
import GATMapView from "./Map";

// Constants and Types
import AnimatedMapActionButtons, {
  SelectedFieldSpeedDial,
} from "./components/AnimatedMapActionButtons";

import { EditFieldCropHistoryPage } from "../fields/EditFieldCropHistoryPage";
import { DeleteFieldDialog } from "../fields/DeleteFieldDialog";

export const MapContainer = () => {
  const [isEditingFieldCropHistory, setIsEditingFieldCropHistory] =
    React.useState(false);

  const [isDeletingField, setIsDeletingField] = React.useState(false);
  return (
    <View style={styles.container}>
      <GATMapView />
      <AnimatedMapActionButtons />
      <SelectedFieldSpeedDial
        onEditCropHistory={() => setIsEditingFieldCropHistory(true)}
        onDeleteField={() => {
          setIsDeletingField(true);
        }}
      />
      {isEditingFieldCropHistory ? (
        <EditFieldCropHistoryPage
          isVisible={isEditingFieldCropHistory}
          onClose={() => setIsEditingFieldCropHistory(false)}
        />
      ) : null}
      {isDeletingField ? (
        <DeleteFieldDialog onClose={() => setIsDeletingField(false)} />
      ) : null}
    </View>
  );
};
export default MapContainer;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
