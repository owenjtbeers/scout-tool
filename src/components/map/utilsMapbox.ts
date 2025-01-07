import { MapRef } from "react-map-gl";
import { GeoJSONObject } from "@turf/helpers";
import bbox from "@turf/bbox";
import { BBox2d } from "@turf/helpers/dist/js/lib/geojson";

export const zoomToFieldBoundaryMapGL = (
  mapRef: React.RefObject<MapRef>,
  fieldBoundary: GeoJSONObject
) => {
  if (!mapRef?.current || !fieldBoundary) return;

  const bbox2D = bbox(fieldBoundary) as BBox2d;
  mapRef.current.fitBounds(bbox2D, { duration: 1000, padding: 100 });
};
