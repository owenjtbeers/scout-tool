import * as FileSystem from "expo-file-system";

global.Buffer = global.Buffer || require("buffer").Buffer;

export const convertUriToBuffer = async (uri: string): Promise<ArrayBuffer> => {
  // Read the file as a base64 string, the files are actually binaries even though
  // they may say encoding in utf-8 in qgis
  let stringContent = await FileSystem.readAsStringAsync(uri, {
    encoding: "base64",
  });
  const buffer = stringToArrayBuffer(stringContent);
  return buffer;
};

export function stringToArrayBuffer(str: string) {
  const binaryView = Buffer.from(str, "base64");
  return binaryView;
}
