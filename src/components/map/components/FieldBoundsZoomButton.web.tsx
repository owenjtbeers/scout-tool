import React from "react";
import { Button } from "@rneui/themed";
import { Entypo } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { MapRef } from "react-map-gl";

import { Field } from "../../../redux/fields/types";

// Turf
import { Feature, featureCollection } from "@turf/helpers";
import bbox from "@turf/bbox";
import { convertTurfBBoxToLatLng } from "../../../utils/latLngConversions";
import { fitToBoundsForMapView } from "../utils";
import { BBox2d } from "@turf/helpers/dist/js/lib/geojson";

interface Props {
  mapRef: React.RefObject<MapRef>;
  fields: Field[] | undefined;
}
const FieldBoundsZoomButton = (props: Props) => {
  const { fields, mapRef } = props;
  const onButtonPress = () => {
    if (fields && fields?.length) {
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
      if (bboxOfFields) {
        mapRef.current?.fitBounds(bboxOfFields, { duration: 1000 });
      }
    }
  };

  const locateIcon = <Entypo name="location" size={25} />;

  return (
    <Button
      onPress={onButtonPress}
      icon={locateIcon}
      buttonStyle={styles.buttonStyle}
      raised={false}
      color={"secondary"}
    />
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 100,
  },
});

export default FieldBoundsZoomButton;
