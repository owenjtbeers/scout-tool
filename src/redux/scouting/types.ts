import type { ScoutingToolUnits } from "../../constants/types";
import type { FeatureCollection } from "@turf/helpers";
export type Observation = {
  type: "insect" | "weed" | "disease" | "general";
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
  id: number;
  uuid: string;
  reportId: number;
  area: FeatureCollection;
  weedObservations: Observation[];
  insectObservations: Observation[];
  diseaseObservations: Observation[];
  generalObservations: Observation[];
};

export type ScoutingReport = {
  id: number;
  fieldId: number;
  summary: string;
  date: string;
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
