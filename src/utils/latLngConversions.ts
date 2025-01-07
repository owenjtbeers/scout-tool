import type { LatLng } from "react-native-maps";
import type {
  FeatureCollection,
  Feature,
  Polygon,
  MultiPolygon,
} from "@turf/helpers";
import { BBox } from "@turf/helpers";

/*
  This function takes a Turf FeatureCollection and returns an array of coordinate arrays.
  Each coordinate array represents a point in the FeatureCollection.

  This needs to account for holes in the polygons, which is why we return a three-dimensional array.
*/
export const featureCollectionToLatLngCoordinates = (
  featureCollection: FeatureCollection<Polygon>
): LatLng[][][] => {
  const polygons: number[][][] = [];
  const convertedPolygons: LatLng[][][] = [];

  featureCollection.features.forEach(
    (feature: Feature<Polygon>, index: number) => {
      convertedPolygons[index] = [];
      // We have to account for holes, which are specified as arrays of coordinates after the first array of coordinates
      feature.geometry.coordinates.forEach((polygon, coordinatesIndex) => {
        polygons[index + coordinatesIndex] = [];
        polygon.forEach((coordinate) => {
          polygons[index + coordinatesIndex].push(coordinate);
        });
        convertedPolygons[index][coordinatesIndex] = mapCoordinatesToLatLng(
          polygons[index + coordinatesIndex]
        );
      });
    }
  );
  console.log("convertedPolygons", convertedPolygons.length, convertedPolygons);
  return convertedPolygons;
};

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
