import type { LatLng } from "react-native-maps";
import type { FeatureCollection, Feature, Polygon } from "@turf/helpers";
import { BBox } from "@turf/helpers";

/*
  This function takes an array of coordinate arrays and returns an array of LatLng objects.
  This is useful for converting the coordinate arrays into a format that can be used by the
  react-native-maps library.
*/
export const mapCoordinatesToLatLng = (coordinates: number[][]): LatLng[] => {
  return coordinates.map((coordinate) => {
    return { latitude: coordinate[1], longitude: coordinate[0] };
  });
};

/*
  This function takes an array of LatLng objects and returns an array of coordinate arrays.
  This is useful for converting the LatLng objects into a format that can be used by the
  @turf/area library.
*/
export const mapLatLngToCoordinates = (latLng: LatLng[]): number[][] => {
  return latLng.map((coordinate) => {
    return [coordinate.longitude, coordinate.latitude];
  });
};

export const convertRNMapsPolygonToTurfFeatureCollection = (
  latLngArray: LatLng[]
): FeatureCollection => {
  return {
    type: "FeatureCollection",
    features: [convertRNMapsPolygonToTurfFeature(latLngArray)],
  };
};

export const convertRNMapsPolygonToTurfFeature = (
  latLngArray: LatLng[]
): Feature<Polygon> => {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [mapLatLngToCoordinates(latLngArray)],
    },
  };
};

export const convertTurfBBoxToLatLng = (bbox: BBox): LatLng[] => {
  return [
    { latitude: bbox[1], longitude: bbox[0] },
    { latitude: bbox[3], longitude: bbox[2] },
  ];
};
