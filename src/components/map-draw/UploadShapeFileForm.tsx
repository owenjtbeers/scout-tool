import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getDocumentAsync, DocumentPickerResult } from "expo-document-picker";
import { ErrorMessage } from "../../forms/components/ErrorMessage";
import { BottomSheet, Button, useTheme } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { drawingSlice } from "../../redux/map/drawingSlice";
import { humanReadableFileSize } from "../../utils/formatting/readableBytes";
import * as FileSystem from "expo-file-system";
import shp from "shpjs";
import { FeatureCollection } from "@turf/helpers";
import turfCentroid from "@turf/centroid";
import MapView from "react-native-maps";

global.Buffer = global.Buffer || require("buffer").Buffer;

type UploadShapeFileFormProps = {
  mapRef: React.RefObject<MapView>;
  setModalVisible: (val: boolean) => void;
};

export const UploadShapeFileForm = (props: UploadShapeFileFormProps) => {
  const { theme } = useTheme();
  const [files, setFiles] = useState<DocumentPickerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const onClose = () => {
    // TODO: This can maybe be set a different way, but for now this can work
    // We really just want to go back to the operation before we hit upload
    dispatch(drawingSlice.actions.setOperation("add-field"));
    props?.setModalVisible(false);
  };
  const handleFileUpload = async () => {
    try {
      const res = await getDocumentAsync({
        type: ["application/x-qgis", "application/octet-stream"],
        multiple: true,
      });
      if (res.canceled) {
        return;
      }
      if (res.assets?.length !== 2) {
        // Check if both a .shp and a .dbf file were selected
        setError(
          "Please select exactly two files, a .shp and a .dbf file (use multiselect)"
        );

        // TODO: Clear the file input
        return;
      }
      const extensions = {} as Record<string, boolean>;
      res.assets.forEach((asset) => {
        const ext = asset.name.split(".").pop();
        if (ext) {
          extensions[ext] = true;
        }
      });
      if (!extensions.shp || !extensions.dbf) {
        setError("Please select exactly two files, a .shp and a .dbf file");
        return;
      }
      setFiles(res);
      setError(null);
    } catch (err) {
      console.log(err);
    }
  };

  // TODO Some warning about how we only support EPSG:4326 and WGS84
  return (
    <BottomSheet
      isVisible={true}
      onBackdropPress={onClose}
      modalProps={{
        statusBarTranslucent: true,
        transparent: true,
        animationType: "slide",
      }}
    >
      <View style={styles.modalView}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 10,
          }}
        >
          <Text>
            Currently we only support the EPSG:4326 coordinate system and WGS84
            projections, if you get results that don't make sense, check the
            projection of your shapefile(s). Uploading a shapefile will clear
            any drawn polygons currently
          </Text>
        </View>
        {error && <ErrorMessage message={error} />}
        <Button title="Pick .dbf and .shp file" onPress={handleFileUpload} />
        {files &&
          files.assets?.map((asset) => {
            return (
              <Text key={asset.name}>{`${asset.name} - ${humanReadableFileSize(
                asset.size || 0
              )}`}</Text>
            );
          })}
        {files && (
          <Button
            title="Upload"
            onPress={async () => {
              try {
                if (!loading) {
                  // Parse shapefiles and create some geojson baby
                  setLoading(true);
                  const shpFileAsset = files.assets?.find((asset) =>
                    asset.name.endsWith(".shp")
                  );
                  const dbfFileAsset = files.assets?.find((asset) =>
                    asset.name.endsWith(".dbf")
                  );

                  if (shpFileAsset && dbfFileAsset) {
                    const shpFileBuffer = await convertUriToBuffer(
                      shpFileAsset.uri
                    );
                    const dbfBuffer = await convertUriToBuffer(
                      dbfFileAsset.uri
                    );
                    const geojson = await shp.combine([
                      shp.parseShp(shpFileBuffer),
                      shp.parseDbf(dbfBuffer, new ArrayBuffer(0)),
                    ]);
                    dispatch(
                      drawingSlice.actions.setTempGeoJSON(
                        geojson as FeatureCollection
                      )
                    );
                    dispatch(drawingSlice.actions.clearPolygons());
                    const centroid = turfCentroid(geojson as FeatureCollection)
                      .geometry.coordinates;
                    props.mapRef.current?.animateCamera({
                      center: { latitude: centroid[1], longitude: centroid[0] },
                    });
                  }
                  setLoading(false);
                  onClose();
                }
              } catch (err) {
                console.log(err);
                setLoading(false);
              }
            }}
            loading={loading}
          />
        )}
      </View>
    </BottomSheet>
  );
};

const convertUriToBuffer = async (uri: string): Promise<ArrayBuffer> => {
  // Read the file as a base64 string, the files are actually binaries even though
  // they may say encoding in utf-8 in qgis
  let stringContent = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
  const buffer = stringToArrayBuffer(stringContent);
  return buffer;
};

function stringToArrayBuffer(str: string) {
  const binaryView = Buffer.from(str, "base64");
  return binaryView;
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    padding: 20,
  },
});
