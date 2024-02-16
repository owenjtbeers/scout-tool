import { FeatureCollection, GeoJSONObject } from "@turf/helpers";

export type Field = {
  id: string;
  name: string;
  farmId: string;
  createdAt: string;
  updatedAt: string;
  activeBoundary: FeatureCollection | null;
};