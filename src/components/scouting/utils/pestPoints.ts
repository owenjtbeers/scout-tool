import type {
  Alias,
  ObservationTypePrefix,
  ScoutingArea,
} from "../../../redux/scouting/types";
import type { PestPoint } from "../../../redux/map/drawingSlice";
import {
  mapCoordinatesToLatLng,
  mapLatLngToCoordinates,
} from "../../../utils/latLngConversions";
import type { Geometry, Position } from "@turf/helpers";
import { getMinimumObservationSetForAlias } from "./scoutReportUtils";

export const convertPestPointsToScoutingArea = (pestPoints: PestPoint[]) => {
  const sortedPestPointsByAlias = pestPoints.reduce((acc, point) => {
    const aliasName = point.Alias?.Name || "No Name";
    if (!acc[aliasName]) {
      acc[aliasName] = [];
    }
    acc[aliasName].push(point);
    return acc;
  }, {} as Record<string, PestPoint[]>);

  const scoutingAreas: ScoutingArea[] = [];
  Object.keys(sortedPestPointsByAlias).forEach((aliasName) => {
    const points = sortedPestPointsByAlias[aliasName];
    const alias = points[0].Alias as Alias;
    const scoutingArea: ScoutingArea = {
      ID: points[0]?.observationAreaId || 0,
      Alias: alias,
      Geometry: {
        type: "FeatureCollection",
        features: points.map((point) => ({
          type: "Feature",
          properties: { addIndex: point.addIndex, color: point.color },
          geometry: {
            type: "Point",
            coordinates: mapLatLngToCoordinates([point.coordinates])[0],
          },
        })),
      },
      ScoutReportId: 0,
      Type: "PointOfInterest",
      WeedObservations:
        alias.Type === "Weed" ? getMinimumObservationSetForAlias(alias) : [],
      InsectObservations:
        alias.Type === "Insect" ? getMinimumObservationSetForAlias(alias) : [],
      DiseaseObservations:
        alias.Type === "Disease" ? getMinimumObservationSetForAlias(alias) : [],
      GeneralObservations:
        alias.Type === "General" ? getMinimumObservationSetForAlias(alias) : [],
      UId: aliasName,
    };
    scoutingAreas.push(scoutingArea);
  });
  return scoutingAreas;
};

export const convertScoutingAreasToPestPoints = (
  scoutingAreas: ScoutingArea[]
) => {
  const pestPoints: PestPoint[] = [];
  if (!scoutingAreas) {
    return pestPoints;
  }
  scoutingAreas.forEach((scoutingArea) => {
    let alias = scoutingArea.Alias as Alias;
    // If we don't have an alias we need to see if we can find a weed, insect, disease, general observation

    scoutingArea.Geometry.features?.forEach((feature) => {
      const geometry = feature.geometry as Geometry;
      const coordinates = geometry.coordinates as Position;
      const point: PestPoint = {
        type: alias.Type as ObservationTypePrefix,
        color: feature?.properties?.color || "red",
        coordinates: mapCoordinatesToLatLng([coordinates])[0],
        Alias: alias,
        addIndex: feature.properties?.addIndex,
        observationAreaId: scoutingArea.ID,
      };
      pestPoints.push(point);
    });
  });
  pestPoints.sort((a, b) => (a.addIndex || 0) - (b.addIndex || 0));
  return pestPoints;
};
