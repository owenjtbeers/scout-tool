import { useTheme } from "@rneui/themed";
import bbox from "@turf/bbox";
import centroid from "@turf/centroid";
import {
  Feature,
  FeatureCollection,
  Position,
  featureCollection,
} from "@turf/helpers";
import React, { RefObject, useCallback, useEffect } from "react";
import { Platform, Text } from "react-native";
import { Layer, Source, Marker, MapRef } from "react-map-gl";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "../../constants/styles";
import { useGetOrgCropsQuery } from "../../redux/crops/cropsApi";
import {
  getColorForFieldCropSeason,
  setOpacityOnHexColor,
  colorWithoutOpacity,
} from "../../redux/crops/utils";
import { Field } from "../../redux/fields/types";
import {
  GLOBAL_SELECTIONS_REDUCER_KEY,
  globalSelectionsSlice,
} from "../../redux/globalSelections/globalSelectionsSlice";
import { RootState } from "../../redux/store";
import {
  convertTurfBBoxToLatLng,
  mapCoordinatesToLatLng,
} from "../../utils/latLngConversions";
import { BBox2d } from "@turf/helpers/dist/js/lib/geojson";
import { GeojsonLayerGL } from "./components/GeojsonLayer.web";
import { isValidBbox } from "../../utils/turfHelpers";

type MapContentManagerProps = {
  mapRef: RefObject<MapRef>;
  fields: Field[] | undefined;
};

export const MapContentManager = (props: MapContentManagerProps) => {
  const { fields, mapRef } = props;
  const selectedField = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].field
  );
  const selectedSeason = useSelector(
    (state: RootState) => state[GLOBAL_SELECTIONS_REDUCER_KEY].season
  );
  const dispatch = useDispatch();
  const { data: orgCropsData } = useGetOrgCropsQuery("default", {
    refetchOnReconnect: true,
  });

  const shouldZoomToBbox = useSelector((state: RootState) => {
    return state[GLOBAL_SELECTIONS_REDUCER_KEY].shouldZoomToBbox;
  });
  useEffect(() => {
    if (shouldZoomToBbox && fields?.length) {
      const features = fields.reduce((acc, field) => {
        const activeBoundary = field?.ActiveBoundary?.Json;
        if (activeBoundary && activeBoundary.features?.length > 0) {
          activeBoundary.features.forEach((feature) => {
            acc.push(feature);
          });
        }
        return acc;
      }, [] as Feature[]);
      const fc = featureCollection(features);
      const bboxOfFields = bbox(fc) as BBox2d;
      if (bboxOfFields && isValidBbox(bboxOfFields)) {
        mapRef.current?.fitBounds(bboxOfFields, { duration: 1000 });
        dispatch(globalSelectionsSlice.actions.setShouldZoomToBbox(false));
      } else {
        console.log("Invalid Bbox");
      }
    }
  }, [shouldZoomToBbox]);
  return (
    <>
      {fields &&
        fields.map((field) => {
          const featureCollection = field?.ActiveBoundary?.Json;
          if (!featureCollection) {
            return null;
          }
          let centroidOfPolygon = undefined;
          try {
            centroidOfPolygon = centroid(
              featureCollection as FeatureCollection
            );
          } catch (e) {
            console.error("Error calculating centroid", e);
          }
          const centroidLatLng = mapCoordinatesToLatLng([
            centroidOfPolygon?.geometry.coordinates as Position,
          ]);
          const fieldColor = getColorForFieldCropSeason(
            orgCropsData?.data,
            field.FieldCrops,
            selectedSeason
          );
          // IDEA: We concatenate all geojson for fields with the same crop / color
          // and then render a single layer with that color, and we then have to put more data
          // into each feature (done when concatenating) so that we can tell a field apart on click
          // This could help with performance issues. We may have to have a layer with all the centroids
          // as well for displaying field labels. Just leaving this here for now.
          return (
            <GeojsonLayerGL
              geojson={featureCollection as FeatureCollection}
              color={fieldColor}
              ID={field.ID}
              fillOpacity={0.5}
              label={field.Name}
              key={`field-${field.ID}`}
            />
          );
        })}
    </>
  );
};
