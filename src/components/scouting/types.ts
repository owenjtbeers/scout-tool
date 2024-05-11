import type {
  ObservationMedia,
  ScoutingArea,
} from "../../redux/scouting/types";

export interface ScoutingReportForm {
  ID?: number; // ID of the scouting report
  scoutedById: number;
  scoutedDate: Date;
  title: string;
  scoutingAreas: ScoutingArea[];
  media: ObservationMedia[];
  summaryText: string;
  recommendationText: string;
  fieldIds: number[];
}
