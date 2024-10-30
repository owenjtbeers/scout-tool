import type { ScoutingReportForm } from "../types";
import type {
  Alias,
  ObservationTypePrefix,
  Observation,
  APIScoutingReport,
  APIObservationArea,
  ScoutingArea,
} from "../../../redux/scouting/types";
import type { ScoutingAppUser } from "../../../redux/user/types";
import { valueIsDefined } from "../../../utils/valueIsDefined";
import { getMinimumObservationSetForAlias, getObservationSetForAlias } from "./scoutReportUtils";
// Outgoing Conversions (Form -> API)
export const mapFormDataToPostScoutReport = (
  scoutReportForm: ScoutingReportForm,
  currentUser?: ScoutingAppUser
): APIScoutingReport => {
  const {
    summaryText,
    scoutingAreas,
    fieldIds,
    scoutedById,
    scoutedDate,
    recommendations,
    growthStage,
    fieldArea,
    fieldAreaUnit,
  } = scoutReportForm;
  return {
    ID: scoutReportForm.ID || 0,
    // TODO: Record the date properly through the UI
    ScoutedDate: scoutedDate.toISOString(),
    // TODO: Record the scouted by properly through the UI
    ScoutedById: scoutedById || currentUser?.ID || 0,
    FieldArea: Number(fieldArea),
    FieldAreaUnit: fieldAreaUnit,
    Summary: summaryText,
    Recommendation: recommendations,
    GrowthStage: growthStage,
    Fields: fieldIds,
    // @ts-ignore TODO: Type this better. The input type to the api is not the same as the output type
    ObservationAreas: scoutingAreas.map((scoutingArea) => {
      return {
        // Note: Spreading here to avoid having to update this everytime something is added to the scouting report interface
        ...scoutingArea,
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
    Images: scoutReportForm.images,
    Crop: scoutReportForm.crop,
    Status: scoutReportForm.status,
  };
};

// Outgoing Conversions (Form -> API)
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
      QuestionVals: alias.observations
        .map(mapFormObservationToAPIQuestionVal)
        .filter((questionVal) => valueIsDefined(questionVal.Value)),
    };
  });
};

// Incoming Conversions (API -> Form)
export const convertObservationAreasToScoutingAreas = (
  observationAreas: APIObservationArea[] | undefined
): ScoutingArea[] => {
  if (!observationAreas) {
    return [];
  }

  const returnVal = observationAreas.map((observationArea) => {
    // Have to set the correct alias on a scouting area so that
    // the UI knows how to properly render it out
    let lastAlias: Alias = {
      ID: 0,
      Name: "",
      Type: "General",
    };
    const newScoutingArea = {
      // Spreading here to avoid having to update this everytime something is added to the scouting report interface
      ...observationArea,
      // @ts-ignore Note: Take the Json right off of the Geometry object
      Geometry: observationArea.Geometry.Json,
      // For Points of Interest, they should have only one type of alias, and one alias for that type. Ex: Weed, Insect, Disease, General.
      // Then one specific alias for that type. Ex: "Aphids", "Powdery Mildew", "Weed 1", "Weed 2", "General 1", "General 2" etc.
      WeedObservations: observationArea.WeedObservations.map((weedObs) => {
        const alias = {
          ID: weedObs.WeedAliasId,
          Name: weedObs.WeedAlias.Name,
          Type: "Weed" as ObservationTypePrefix,
        };
        lastAlias = alias;
        const questionVals = weedObs.WeedQuestionVals;
        if (!questionVals || questionVals?.length === 0) {
          return getObservationSetForAlias(alias);
        }
        return weedObs.WeedQuestionVals.map((weedQuestionVal) => {
          const questionVal = weedQuestionVal.QuestionVal;
          return {
            ID: questionVal.ID,
            Alias: alias,
            questionType: questionVal.RenderType,
            name: questionVal.Question,
            options: questionVal.Options.split(","),
            value: questionVal.Value,
            tags: null,
            ScoutingAreaId: observationArea.ID,
          } as Observation;
        });
      }).flat(),
      InsectObservations: observationArea.InsectObservations.map(
        (insectObs) => {
          const alias = {
            ID: insectObs.InsectAliasId,
            Name: insectObs.InsectAlias.Name,
            Type: "Insect" as ObservationTypePrefix,
          };
          lastAlias = alias;
          const questionVals = insectObs.InsectQuestionVals;
          if (!questionVals || questionVals?.length === 0) {
            return getObservationSetForAlias(alias);
          }
          return insectObs.InsectQuestionVals.map((insectQuestionVal) => {
            const questionVal = insectQuestionVal.QuestionVal;
            return {
              ID: questionVal.ID,
              Alias: alias,
              questionType: questionVal.RenderType,
              name: questionVal.Question,
              options: questionVal.Options.split(","),
              value: questionVal.Value,
              tags: null,
              ScoutingAreaId: observationArea.ID,
            } as Observation;
          });
        }
      ).flat(),
      DiseaseObservations: observationArea.DiseaseObservations.map(
        (diseaseObs) => {
          const alias = {
            ID: diseaseObs.DiseaseAliasId,
            Name: diseaseObs.DiseaseAlias.Name,
            Type: "Disease" as ObservationTypePrefix,
          };
          lastAlias = alias;
          const questionVals = diseaseObs.DiseaseQuestionVals;
          if (!questionVals || questionVals?.length === 0) {
            return getObservationSetForAlias(alias);
          }
          return diseaseObs.DiseaseQuestionVals.map((diseaseQuestionVal) => {
            const questionVal = diseaseQuestionVal.QuestionVal;
            return {
              ID: questionVal.ID,
              Alias: alias,
              questionType: questionVal.RenderType,
              name: questionVal.Question,
              options: questionVal.Options.split(","),
              valueUnit1: questionVal.ValueUnit1,
              valueUnit2: questionVal.ValueUnit2,
              value: questionVal.Value,
              tags: null,
              ScoutingAreaId: observationArea.ID,
            } as Observation;
          });
        }
      ).flat(),
      GeneralObservations: observationArea.GeneralObservations.map(
        (generalQuestionVal) => {
          const alias = {
            ID: 0,
            Name: generalQuestionVal.Question,
            Type: "General" as ObservationTypePrefix,
          };
          lastAlias = alias;
          return {
            ID: generalQuestionVal.ID,
            Alias: alias,
            questionType: generalQuestionVal.RenderType,
            name: generalQuestionVal.Question,
            options: generalQuestionVal.Options.split(","),
            value: generalQuestionVal.Value,
            tags: null,
            ScoutingAreaId: observationArea.ID,
          };
        }
      ),
    } as ScoutingArea;
    if (newScoutingArea.Type === "PointOfInterest") {
      newScoutingArea.Alias = lastAlias as Alias;
    }
    return newScoutingArea;
  });
  return returnVal;
};

// Incoming Conversions (API -> Form)
const mapFormObservationToAPIQuestionVal = (observation: Observation) => {
  return {
    ID: observation.ID || 0,
    Question: observation.name,
    Value: String(observation.value),
    Options: observation.options?.join(","),
    RenderType: observation.questionType,
    ValueUnit1: observation.valueUnit1,
    ValueUnit2: observation.valueUnit2,
  };
};
