import type { ScoutingToolUnits } from "../../constants/types";
import type { FeatureCollection } from "@turf/helpers";
import type { ScoutingAppUser } from "../user/types";

export type ObservationTypePrefix = "Weed" | "Insect" | "Disease" | "General";
export type Observation = {
  name: string;
  questionType:
    | "text"
    | "select"
    | "multiselect"
    | "numeric"
    | "numeric-slider";
  value: string;
  options?: string[];
  valueUnit1?: ScoutingToolUnits;
  valueUnit2?: ScoutingToolUnits;
  tags: string | null;
  ScoutingAreaId: number;
  Alias: { ID: number; Name: string };
};

export type ScoutingArea = {
  ID: number;
  UId: string;
  ScoutReportId: number;
  Geometry: { Json: FeatureCollection } | FeatureCollection;
  WeedObservations: Observation[];
  InsectObservations: Observation[];
  DiseaseObservations: Observation[];
  GeneralObservations: Observation[];
};

export type ScoutingReport = {
  ID: number;
  Fields: number[];
  FieldIds: { ID: number; Name: string }[];
  Summary: string;
  ScoutedDate: string;
  ScoutedById: number;
  ScoutedBy: ScoutingAppUser;
  ObservationAreas?: ScoutingArea[];
};

export type ObservationMedia = {
  id: number;
  mediaType: "image";
  mediaUrl: string;
  ObservationId: number;
};

export type OrgWeed = {
  ID: number;
  WeedAlias?: WeedAlias;
  WeedAliasId: number;
  WeedId: number;
  AddedById: number;
};

export interface Alias {
  ID: number;
  Name: string;
}

export type WeedAlias = {
  ID: number;
  Name: string;
  WeedId?: number;
  Weed?: Weed;
};

export type Weed = {
  ID: number;
  ScientificName: string;
  OfficialCommonName: string;
};

export type OrgDisease = {
  ID: number;
  DiseaseAlias?: DiseaseAlias;
  DiseaseAliasId: number;
  DiseaseId: number;
  AddedById: number;
};

export type DiseaseAlias = {
  ID: number;
  Name: string;
  DiseaseId?: number;
  Disease?: Disease;
};

export type Disease = {
  ID: number;
  ScientificName: string;
  OfficialCommonName: string;
};
