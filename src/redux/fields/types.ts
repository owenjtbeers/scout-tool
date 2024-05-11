import { FeatureCollection } from "@turf/helpers";

export type Field = {
  ID: number;
  Name: string;
  GrowerId: number;
  FarmId: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  ActiveBoundary: Boundary | null;
};

export type Boundary = {
  Json: FeatureCollection;
  Boundary: null;
};
