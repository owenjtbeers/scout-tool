import React, { RefObject } from "react";

import MapView from "react-native-maps";
import DrawingManager from "./DrawingManager";

export const MapContentManager = (props: { mapRef: RefObject<MapView> }) => {
  return (
    <>
      <DrawingManager mapRef={props.mapRef} />
    </>
  );
};
