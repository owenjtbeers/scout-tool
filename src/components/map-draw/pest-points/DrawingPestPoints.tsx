import React from "react";
import { Marker } from "react-native-maps";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import {
  drawingSlice,
  MAP_DRAWING_REDUCER_KEY,
} from "../../../redux/map/drawingSlice";
import { PestPointComponent } from "./PestPointComponent";

export const DrawingPestPoints = (props: { isDrawing: boolean }) => {
  const dispatch = useDispatch();
  const points = useSelector(
    (state: RootState) => state[MAP_DRAWING_REDUCER_KEY].pestPoints
  );
  if (!points || points?.length === 0) {
    return null;
  }
  return points.map((point, index) => {
    return (
      <Marker
        key={`Marker-${index}`}
        coordinate={point.coordinates}
        draggable
        tracksViewChanges={false}
        title={`${point.type} - ${point.Alias?.Name}`}
        onDragEnd={(event) => {
          dispatch(
            drawingSlice.actions.setPestPoint({
              index,
              point: { ...point, coordinates: event.nativeEvent.coordinate },
            })
          );
        }}
      >
        <PestPointComponent pestPoint={point} />
      </Marker>
    );
  });
};
