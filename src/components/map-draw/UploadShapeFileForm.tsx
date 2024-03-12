import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { getDocumentAsync, DocumentPickerResult } from "expo-document-picker";
import { ErrorMessage } from "../../forms/components/ErrorMessage";
import { BottomSheet, Button } from "@rneui/themed";
import { useDispatch } from "react-redux";
import { drawingSlice } from "../../redux/map/drawingSlice";
import { humanReadableFileSize } from "../../utils/formatting/readableBytes";
import * as FileSystem from "expo-file-system";
import { ActivityIndicator } from "react-native";
import shp from "shpjs";

global.Buffer = global.Buffer || require("buffer").Buffer;

export const UploadShapeFileForm = () => {
  const [files, setFiles] = useState<DocumentPickerResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const onClose = () => {
    // TODO: This can maybe be set a different way, but for now this can work
    // We really just want to go back to the operation before we hit upload
    dispatch(drawingSlice.actions.setOperation("add-field"));
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
      if (res.assets?.length !== 1) {
        // Check if both a .shp and a .dbf file were selected
        setError("Please select exactly one file, a .shp file");

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
      if (!extensions.shp) {
        setError("Please select exactly one file, a .shp file");
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

                  if (shpFileAsset) {
                    const shpFileBuffer = await convertUriToBuffer(
                      shpFileAsset.uri
                    );

                    const geojson = await shp.parseShp(shpFileBuffer);
                    console.log(geojson);
                  }
                  setLoading(false);
                }
              } catch (err) {
                console.log(err);
              }
            }}
          >
            {loading ? <ActivityIndicator /> : <Text>Upload</Text>}
          </Button>
        )}
      </View>
    </BottomSheet>
  );
};

const convertUriToBuffer = async (uri: string): Promise<ArrayBuffer> => {
  console.log(uri);
  let stringContent = await FileSystem.readAsStringAsync(uri, {
    encoding: "utf8",
  });
  console.log(stringContent);
  const buffer = stringToArrayBuffer(stringContent);
  const buffer2 = stringToArrayBufferWithCharCode(stringContent);
  console.log("buffer1", buffer);
  console.log("buffer2", buffer2);
  return buffer;
};

function stringToArrayBuffer(str: string) {
  const binaryString = Buffer.from(str, "utf8");
  return binaryString;
}

function stringToArrayBufferWithCharCode(str: string) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: "white",
    padding: 20,
  },
});
