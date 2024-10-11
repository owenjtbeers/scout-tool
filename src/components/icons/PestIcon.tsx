import React from "react";

import { WeedIcon } from "./WeedIcon";
import { DiseaseIcon } from "./DiseaseIcon";
import { InsectIcon } from "./InsectIcon";
import { GeneralIcon } from "./GeneralIcon";
import { FontAwesome5 } from "@expo/vector-icons";
import type { IconProps } from "./types";
import type { ObservationTypePrefix } from "../../redux/scouting/types";
interface PestIconProps extends IconProps {
  type?: ObservationTypePrefix;
}

// This component is used to render the appropriate icon for a given pest type.
export const PestIcon = (props: PestIconProps) => {
  switch (props.type) {
    case "Weed":
      return <WeedIcon size={props.size} color={props.color} />;
    case "Disease":
      return <DiseaseIcon size={props.size} color={props.color} />;
    case "Insect":
      return <InsectIcon size={props.size} color={props.color} />;
    case "General":
      return <GeneralIcon size={props.size} color={props.color} />;
    default:
      return <FontAwesome5 name="exclamation-circle" size={24} color={"red"} />;
  }
};
