import type {
  ScoutingArea,
  ScoutingImage,
  ScoutingReportStatus,
} from "../../redux/scouting/types";
import type { Field } from "../../redux/fields/types";
import type { Crop, OrgCrop } from "../../redux/crops/types";

export interface ScoutingReportForm {
  ID?: number; // ID of the scouting report
  crop: OrgCrop;
  scoutedById: number;
  scoutedDate: Date;
  title: string;
  scoutingAreas: ScoutingArea[];
  summaryText: string;
  recommendations: string;
  growthStage: string;
  fieldIds: number[];
  images: ScoutingImage[];
  field: Field;
  growerName: string;
  growerEmail: string;
  farmName: string;
  status: ScoutingReportStatus;
  uniqueDraftID?: string;
}
