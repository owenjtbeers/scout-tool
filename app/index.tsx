import { Redirect } from "expo-router";
import { INFO_LANDING_SCREEN } from "../src/navigation/screens";

export default function Page() {
  return <Redirect href={INFO_LANDING_SCREEN} />;
}
