import type {
  ScoutingArea,
  Alias,
  Observation,
  ObservationTypePrefix,
  ScoutingReport,
} from "../../../redux/scouting/types";
import { ScoutingAppUser } from "../../../redux/user/types";
import type { ScoutingReportForm } from "../types";

const valueIsDefined = (value: string | number | null | undefined): boolean => {
  if (value === "") {
    return false;
  }
  return value !== null && value !== undefined;
};
export const getNumberOfObservationsFromScoutingArea = (
  scoutingArea: ScoutingArea
): number => {
  return (
    scoutingArea?.WeedObservations?.filter((weedObs) =>
      valueIsDefined(weedObs.value)
    )?.length +
      scoutingArea?.InsectObservations?.filter((insectObs) =>
        valueIsDefined(insectObs.value)
      )?.length +
      scoutingArea?.DiseaseObservations?.filter((diseaseObs) =>
        valueIsDefined(diseaseObs.value)
      )?.length +
      scoutingArea?.GeneralObservations?.filter((generalObs) =>
        valueIsDefined(generalObs.value)
      )?.length || 0
  );
};

export const getNewWeedObservationSet = (alias: Alias): Observation[] => {
  return [
    {
      Alias: alias,
      questionType: "select",
      name: "Density",
      options: ["Low", "Medium", "High"],
      value: "",
      tags: null,
      ScoutingAreaId: 0,
    },
    {
      Alias: alias,
      questionType: "numeric-slider",
      name: "Height",
      value: "",
      options: ["0", "48"],
      valueUnit1: "inches",
      // valueUnit2: "m2",
      tags: null,
      ScoutingAreaId: 0,
    },
    {
      Alias: alias,
      questionType: "numeric-slider",
      name: "Diameter",
      value: "",
      options: ["0", "3"],
      valueUnit1: "inches",
      // valueUnit2: "m2",
      tags: null,
      ScoutingAreaId: 0,
    },
    {
      Alias: alias,
      questionType: "text",
      name: "Leaf Stage",
      options: [],
      value: "",
      tags: null,
      ScoutingAreaId: 0,
    },
  ];
};

/*
  This function is used to get a map of recent observations from a list of scouting areas.
  this will include a count of the number of times that alias has been observed in scouting areas.
  If the alias has been observed multiple times in the same scouting area, it will only be counted once.
  @param observationAreas: a list of scouting areas
  @returns a map of alias names and the number of times they have been observed in the scouting areas
*/
export const getRecentAliasesFromObservations = (
  observationAreas: ScoutingArea[],
  type?: ObservationTypePrefix
): Map<string, number> => {
  const keyMapping = {
    Weed: "WeedObservations",
    Insect: "InsectObservations",
    Disease: "DiseaseObservations",
    General: "GeneralObservations",
  } as { [key: string]: keyof ScoutingArea };
  let keys = Object.values(keyMapping);
  if (type) {
    keys = [keyMapping[type]];
  }
  const recentMap = new Map<string, number>();
  observationAreas.forEach((scoutingArea) => {
    const scoutingAreaMap = new Map<string, number>();
    const filteredObservations = keys.map(
      (key) => scoutingArea[key] as Observation[]
    );

    const recentObservations: Observation[] = [].concat(
      // @ts-ignore TODO: Figure out how to type this properly
      ...filteredObservations
    );
    // We want to create a unique list of the alias names found at this scouting area
    recentObservations.forEach((observation) => {
      const alias = observation?.Alias?.Name;
      const count = scoutingAreaMap.get(alias || "");
      if (count === undefined && !!alias) {
        scoutingAreaMap.set(alias, 1);
      }
    });

    // We want to increment the count of the alias names found at this scouting area
    for (const [alias, _] of scoutingAreaMap.entries()) {
      const recentCount = recentMap.get(alias);
      if (recentCount !== undefined) {
        recentMap.set(alias, recentCount + 1);
      } else {
        recentMap.set(alias, 1);
      }
    }
  });
  return recentMap;
};

export const mapFormDataToPostScoutReport = (
  scoutReportForm: ScoutingReportForm,
  currentUser?: ScoutingAppUser
): ScoutingReport => {
  const { summaryText, scoutingAreas, fieldIds, scoutedById, scoutedDate } =
    scoutReportForm;
  return {
    ID: 0,
    // TODO: Record the date properly through the UI
    ScoutedDate: scoutedDate.toISOString(),
    // TODO: Record the scouted by properly through the UI
    ScoutedById: scoutedById || currentUser?.ID || 0,
    Summary: summaryText,
    Fields: fieldIds,
    // @ts-ignore TODO: Type this better. The input type to the api is not the same as the output type
    ObservationAreas: scoutingAreas.map((scoutingArea) => {
      return {
        ID: scoutingArea.ID,
        UId: scoutingArea.UId,
        ScoutReportId: scoutingArea.ScoutReportId,
        Geometry: scoutingArea.Geometry,
        WeedObservations: mapScoutingAreaObservationsToAPITypeObservation(
          scoutingArea.WeedObservations
        ),
        InsectObservations: mapScoutingAreaObservationsToAPITypeObservation(
          scoutingArea.InsectObservations
        ),
        DiseaseObservations: mapScoutingAreaObservationsToAPITypeObservation(
          scoutingArea.DiseaseObservations
        ),
        GeneralObservations: scoutingArea.GeneralObservations.map(
          mapFormObservationToAPIQuestionVal
        ),
      };
    }),
  };
};

const mapScoutingAreaObservationsToAPITypeObservation = (
  observations: Observation[]
) => {
  // Group the observations by alias
  const aliasMap = observations.reduce((acc, observation) => {
    const { Alias } = observation;
    if (!Alias) {
      return acc;
    }
    if (!acc[Alias.Name]) {
      acc[Alias.Name] = { ID: Alias.ID, observations: [] as Observation[] };
    }
    acc[Alias.Name].observations.push(observation);
    return acc;
  }, {} as Record<string, { ID: number; observations: Observation[] }>);

  // Map the grouped observations to the API format
  return Object.keys(aliasMap).map((aliasName) => {
    const alias = aliasMap[aliasName];
    return {
      AliasName: aliasName,
      AliasId: alias.ID,
      QuestionVals: alias.observations.map(mapFormObservationToAPIQuestionVal),
    };
  });
};
const mapFormObservationToAPIQuestionVal = (observation: Observation) => {
  return {
    Question: observation.name,
    Value: String(observation.value),
    Options: observation.options?.join(","),
    RenderType: observation.questionType,
    ValueUnit1: observation.valueUnit1,
    ValueUnit2: observation.valueUnit2,
  };
};
