import type {
  ObservationMedia,
  ScoutingArea,
} from "../../redux/scouting/types";

export interface ScoutingReportForm {
  scoutingAreas: ScoutingArea[];
  media: ObservationMedia[];
  summaryText: string;
  recommendationText: string;
}
