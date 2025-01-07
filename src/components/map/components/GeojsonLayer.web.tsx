import React from "react";
import { colorWithoutOpacity } from "../../../redux/crops/utils";
import { Source, Layer } from "react-map-gl";
import { FeatureCollection, GeoJSONObject } from "@turf/helpers";
import centroid from "@turf/centroid";

interface GeojsonLayerGLProps {
  geojson: FeatureCollection;
  ID: number;
  color: string;
  label?: string;
  fillOpacity?: number;
}
export const GeojsonLayerGL = (props: GeojsonLayerGLProps) => {
  const { geojson, color, fillOpacity, ID, label } = props;
  if (!geojson) {
    return null;
  }
  let centroidOfPolygon = undefined;
  if (label) {
    try {
      centroidOfPolygon = centroid(geojson);
    } catch (e) {
      console.error("Error calculating centroid", e);
    }
  }

  return (
    <>
      <Source
        id={`field-${ID}`}
        data={geojson}
        type={"geojson"}
        key={`polygon-${ID}`}
        label
      >
        <Layer
          id={`fill-field-${ID}`}
          type={"fill"}
          paint={{
            "fill-color": colorWithoutOpacity(color),
            "fill-opacity": fillOpacity || 0.5,
            "fill-outline-color": colorWithoutOpacity(color),
          }}
        />
        <Layer
          id={`outline-field-${ID}`}
          type={"line"}
          layout={{
            "line-cap": "round",
            "line-join": "round",
          }}
          paint={{
            "line-color": colorWithoutOpacity(color),
            "line-width": 2, // Adjust the width as needed
          }}
        />
      </Source>
      {label && (
        <Source
          type={"geojson"}
          key={`label-${ID}`}
          data={centroidOfPolygon}
          id={`field-label-${ID}`}
        >
          <Layer
            id={`text-field-${ID}`}
            type={"symbol"}
            layout={{
              "text-field": label,
              "text-size": 15,
              "text-anchor": "center",
              // "text-offset": [0, 0],
              "text-justify": "center",
              // "text-allow-overlap": true,
              "symbol-placement": "point",
            }}
          />
        </Source>
      )}
    </>
  );
};
