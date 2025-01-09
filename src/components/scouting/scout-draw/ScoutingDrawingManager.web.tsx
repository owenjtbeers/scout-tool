import React from "react";
import type { MapRef } from "react-map-gl";

import { DrawingManager } from "../../map-draw/DrawingManager.web";

export const ScoutingDrawingManager = (props: {
  mapRef: React.RefObject<MapRef>;
}) => {
  return <DrawingManager mapRef={props.mapRef} />;
};
