import React from "react";
import { PestPoint } from "../../../redux/map/drawingSlice";
import { DiseaseMarkerComponent } from "./DiseasePoint";
import { GeneralPestMarkerComponent } from "./GeneralPoint";
import { InsectMarkerComponent } from "./InsectPoint";
import { WeedMarkerComponent } from "./WeedPoint";

export const PestPointComponent = (props: { pestPoint: PestPoint }) => {
  const { pestPoint } = props;
  if (!pestPoint?.type) {
    return null;
  }
  switch (pestPoint.type) {
    case "Weed":
      return <WeedMarkerComponent pestPoint={pestPoint} />;
    case "Insect":
      return <InsectMarkerComponent pestPoint={pestPoint} />;
    case "Disease":
      return <DiseaseMarkerComponent pestPoint={pestPoint} />;
    case "General":
      return <GeneralPestMarkerComponent pestPoint={pestPoint} />;
  }
};
