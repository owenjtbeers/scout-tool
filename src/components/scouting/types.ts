import type {
  ScoutingArea,
  ScoutingImage,
  ScoutingReportStatus,
} from "../../redux/scouting/types";
import type { Field } from "../../redux/fields/types";
import type { OrgCrop } from "../../redux/crops/types";
import { ScoutingToolUnits } from "../../constants/types";

export interface ScoutingReportForm {
  ID?: number; // ID of the scouting report
  crop: OrgCrop;
  scoutedById: number;
  scoutedDate: Date;
  title: string;
  scoutingAreas: ScoutingArea[];
  fieldArea: number;
  fieldAreaUnit: ScoutingToolUnits;
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
