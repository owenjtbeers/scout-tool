import type { Units } from "@turf/helpers";

type AdditionalUnits = "plants" | "insects" | "disease" | "m2";
export type ScoutingToolUnits = Units | AdditionalUnits;
