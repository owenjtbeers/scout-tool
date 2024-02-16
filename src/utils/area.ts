import area from "@turf/area";
import {
  polygon as turfPolygon,
  Position,
  convertArea,
  Units,
  round,
} from "@turf/helpers";
import { LatLng } from "react-native-maps";

export const RNMapsPolygonArea = (
  polygon: LatLng[],
  unit: Units = "meters",
  precision: number | undefined = undefined
) => {
  if (polygon.length < 4) {
    return 0;
  }
  console.log("Calculating area for polygon in RNMapsPolygonArea", polygon);
  const convertedPolygon = polygon.map(
    (point) => [point.longitude, point.latitude] as Position
  );

  let calculatedArea = area(turfPolygon([convertedPolygon]));
  if (unit !== "meters" && calculatedArea !== undefined) {
    calculatedArea = convertArea(calculatedArea, "meters", unit);
  }

  if (precision !== undefined) {
    calculatedArea = round(calculatedArea, precision);
  }
  return calculatedArea;
};
