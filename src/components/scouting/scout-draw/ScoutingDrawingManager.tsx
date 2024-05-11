import React from "react";
import type MapView from "react-native-maps";

import { DrawingManager } from "../../map-draw/DrawingManager";

export const ScoutingDrawingManager = (props: {
  mapRef: React.RefObject<MapView>;
}) => {
  return <DrawingManager mapRef={props.mapRef} />;
};

