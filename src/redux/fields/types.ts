import { FeatureCollection } from "@turf/helpers";

export type Field = {
  ID: string;
  Name: string;
  FarmId: string;
  CreatedAt: string;
  UpdatedAt: string;
  ActiveBoundary: Boundary | null;
};

export type Boundary = {
  Json: FeatureCollection;
  Boundary: null;
};
