import { FeatureCollection, GeoJSONObject } from "@turf/helpers";

export type Field = {
  id: string;
  Name: string;
  FarmId: string;
  CreatedAt: string;
  UpdatedAt: string;
  ActiveBoundary: FeatureCollection | null;
};