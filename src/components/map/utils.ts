import { RefObject } from "react";
import MapView, { LatLng } from "react-native-maps";

export const fitToBoundsForMapView = (
  mapRef: RefObject<MapView>,
  bounds: LatLng[]
) => {
  if (mapRef.current) {
    mapRef.current.fitToCoordinates(bounds, {
      edgePadding: {
        top: 70,
        right: 70,
        bottom: 70,
        left: 70,
      },
    });
  }
};