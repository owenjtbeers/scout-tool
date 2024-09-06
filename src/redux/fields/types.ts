import { FeatureCollection } from "@turf/helpers";
import type { FieldCrop } from "../crops/types";

export type Field = {
  ID: number;
  Name: string;
  GrowerId: number;
  FarmId: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  ActiveBoundary: Boundary | null;
  ActiveCrop: FieldCrop | null;
  FieldCrops: FieldCrop[];
};

export type Boundary = {
  Json: FeatureCollection;
  Boundary: null;
};
