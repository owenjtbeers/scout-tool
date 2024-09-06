import type { ScoutingToolUnits } from "../../constants/types";
import type { FeatureCollection } from "@turf/helpers";
import type { ScoutingAppUser } from "../user/types";
import type { Asset } from "expo-media-library";
import { OrgCrop } from "../crops/types";

export type ObservationTypePrefix = "Weed" | "Insect" | "Disease" | "General";
export type Observation = {
  ID?: number;
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

export type APIQuestionVal = {
  ID: number;
  Question: Observation["name"];
  Value: Observation["value"];
  ObservationAreaId: Observation["ScoutingAreaId"];
  ValueUnit1: Observation["valueUnit1"];
  ValueUnit2: Observation["valueUnit2"];
  RenderType: Observation["questionType"];
  // This is a string, that should be split on the ',' character
  Options: string;
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

/*
  This type is a lot like ScoutingArea but has some key differences
  Weeds, Insects, Diseases have type specific fields that look a lot like Observation
  but not the same
*/
export type APIObservationArea = {
  ID: number;
  UId: string;
  ScoutReportId: number;
  Geometry: { Json: FeatureCollection } | FeatureCollection;
  WeedObservations: WeedObservation[];
  InsectObservations: InsectObservation[];
  DiseaseObservations: DiseaseObservation[];
  GeneralObservations: APIQuestionVal[];
};

export type APIScoutingReport = {
  ID: number;
  Fields: number[];
  FieldIds: { ID: number; Name: string }[];
  GrowthStage: string;
  Summary: string;
  Recommendation: string;
  ScoutedDate: string;
  ScoutedById: number;
  ScoutedBy: ScoutingAppUser;
  ObservationAreas?: APIObservationArea[];
  Images: ScoutingImage[];
  ImageUploads?: ScoutingImage[];
  Crop: OrgCrop;
  CropId: number;
  Status: ScoutingReportStatus;
};

export type ScoutingReportStatus = "draft" | "in_review" | "passed_review";

export type ScoutingImage = {
  ID: number;
  Url: string;
  // This is saved on the backend as a string, should be the url as it was on the device
  Filename?: string;
  ObservationAreaId: number;
  ObservationAreaUid: string;
  WeedAliasId: number;
  WeedAlias?: Partial<WeedAlias>;
  DiseaseAliasId: number;
  DiseaseAlias?: Partial<DiseaseAlias>;
  InsectAliasId: number;
  InsectAlias?: Partial<InsectAlias>;
  QuestionValId: number;
  QuestionVal?: Observation;
  Type?: ObservationTypePrefix;
  AddedById: number;
  UploadLink?: string;
  // This is attached in the case of local images before they are saved
  // To easily reference the newly created image
  asset?: Asset;
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

export type OrgInsect = {
  ID: number;
  InsectAlias?: InsectAlias;
  InsectAliasId: number;
  InsectId: number;
  AddedById: number;
};

export type Insect = {
  ID: number;
  ScientificName: string;
  OfficialCommonName: string;
};

export type InsectAlias = {
  ID: number;
  Name: string;
  InsectId?: number;
  Insect?: Insect;
};

/*
  In the API these all have type specific keys, such as InsectObservationId, DiseaseObservationId, WeedObservationId
  These aren't relevant yet to the front end so they are omitted
*/
type NestedQuestionVal<T> = {
  QuestionVal: APIQuestionVal;
};

export type WeedObservation = {
  WeedQuestionVals: NestedQuestionVal<Weed>[];
  WeedAlias: WeedAlias;
  WeedAliasId: number;
  ObservationAreaId: number;
  ID: number;
};

export type DiseaseObservation = {
  DiseaseQuestionVals: NestedQuestionVal<Disease>[];
  DiseaseAlias: DiseaseAlias;
  DiseaseAliasId: number;
  ObservationAreaId: number;
  ID: number;
};

export type InsectObservation = {
  InsectQuestionVals: NestedQuestionVal<Insect>[];
  InsectAlias: InsectAlias;
  InsectAliasId: number;
  ObservationAreaId: number;
  ID: number;
};
