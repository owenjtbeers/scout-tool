import type {
  ObservationMedia,
  ScoutingArea,
} from "../../redux/scouting/types";

export interface ScoutingReportForm {
  scoutedById: number;
  scoutedDate: Date;
  title: string;
  scoutingAreas: ScoutingArea[];
  media: ObservationMedia[];
  summaryText: string;
  recommendationText: string;
  fieldIds: number[];
}
