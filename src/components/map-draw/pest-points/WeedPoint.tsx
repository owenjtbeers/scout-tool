import React from "react";
import { View } from "react-native";
import { Text } from "@rneui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { WeedIcon } from "../../icons/Icons";
import { PestPoint } from "../../../redux/map/drawingSlice";

import { styles } from "./styles";

export const WeedMarkerComponent = (props: { pestPoint: PestPoint }) => {
  const { pestPoint } = props;
  if (!pestPoint) {
    return null;
  }
  return (
    <View style={{ height: 41, width: 41 }}>
      <FontAwesome5
        name="map-marker"
        size={40}
        color={pestPoint.color || "red"}
      ></FontAwesome5>
      <View style={styles.iconCenteringStyle}>
        <WeedIcon size={22} />
      </View>
    </View>
  );
};
