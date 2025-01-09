import { MapRef } from "react-map-gl";
import { GeoJSONObject } from "@turf/helpers";
import bbox from "@turf/bbox";
import { BBox2d } from "@turf/helpers/dist/js/lib/geojson";
import { isValidBbox } from "../../utils/turfHelpers";

export const zoomToFieldBoundaryMapGL = (
  mapRef: React.RefObject<MapRef>,
  fieldBoundary: GeoJSONObject
) => {
  if (!mapRef?.current || !fieldBoundary) return;

  const bbox2D = bbox(fieldBoundary) as BBox2d;
  zoomToBBoxMapGL(mapRef, bbox2D);
};

export const zoomToBBoxMapGL = (
  mapRef: React.RefObject<MapRef>,
  bbox2D: BBox2d
) => {
  if (!mapRef?.current || !bbox2D) return;

  if (isValidBbox(bbox2D)) {
    mapRef.current.fitBounds(bbox2D, { duration: 1000, padding: 100 });
  } else {
    console.log("Invalid Bbox");
  }
};
