import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Alias, Observation, ObservationTypePrefix } from "./types";

export const useGetUnsavedAliasesFromDraftedReport = () => {
  const draftedReports = useSelector((state: RootState) => state.scoutingSlice.draftedReports);

  const aliases: { [key: string]: Alias } = {};
  const draftedReportKeys = Object.keys(draftedReports);
  draftedReportKeys.forEach((key) => {
    const report = draftedReports[key];
    report.scoutingAreas.forEach((area) => {
      const weedAliases = getAliasesFromObservations(area.WeedObservations, "Weed");
      const insectAliases = getAliasesFromObservations(area.InsectObservations, "Insect");
      const diseaseAliases = getAliasesFromObservations(area.DiseaseObservations, "Disease");
      const allAliases = [...weedAliases, ...insectAliases, ...diseaseAliases];
      allAliases.forEach((alias) => {
        if (alias.ID === 0 && !aliases[alias.Name]) {
          aliases[alias.Name] = alias;
        }
      });
    });
  });

  return Object.values(aliases);
};

const getAliasesFromObservations = (observations: Observation[], type: ObservationTypePrefix) => {
  return observations.map((obs) => {
    return {
      ...obs.Alias,
      Type: type,
    };
  });
};
