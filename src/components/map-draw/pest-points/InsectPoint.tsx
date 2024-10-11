import React from "react";
import { View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { InsectIcon } from "../../icons/Icons";
import { PestPoint } from "../../../redux/map/drawingSlice";

import { styles } from "./styles";

export const InsectMarkerComponent = (props: { pestPoint: PestPoint }) => {
  const { pestPoint } = props;
  if (!pestPoint) {
    return null;
  }
  return (
    <View style={{ alignItems: "center" }}>
      <FontAwesome5
        name="map-marker"
        size={40}
        color={pestPoint.color || "red"}
      ></FontAwesome5>
      <View style={styles.insectIconCenteringStyle}>
        <InsectIcon size={24} />
      </View>
    </View>
  );
};
