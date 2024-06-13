import type { ScoutingArea, ScoutingImage } from "../../redux/scouting/types";

export interface ScoutingReportForm {
  ID?: number; // ID of the scouting report
  scoutedById: number;
  scoutedDate: Date;
  title: string;
  scoutingAreas: ScoutingArea[];
  summaryText: string;
  recommendationText: string;
  fieldIds: number[];
  images: ScoutingImage[];
}
