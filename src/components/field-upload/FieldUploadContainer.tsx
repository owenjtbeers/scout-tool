import React, { useRef } from 'react';

// Components
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, useTheme, Text, Dialog } from "@rneui/themed"
import { FieldUploadTabIcon } from '../layout/bottomBar/BottomButtons';
import { MaterialIcons } from '@expo/vector-icons';

// Libraries
// const zip = require("@zip.js/zip.js");
import JSZip from 'jszip';
import shp from 'shpjs';

// Buffer
global.Buffer = global.Buffer || require("buffer").Buffer;

const FieldUploadContainer: React.FC = () => {
  const { theme } = useTheme();
  const [file, setFile] = React.useState<File | null>(null);
  const [fileEntries, setFileEntries] = React.useState<JSZip.JSZipObject[] | null>(null);
  let zipReader = null;
  const [isLoading, setIsLoading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      // Clear file entries
      setFileEntries(null);
      zipReader = null;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setIsLoading(true);
    try {
      if (file) {
        // Handle the file upload logic here
        setFile(file);
        // Parse the file here
        const data = await file.arrayBuffer();
        const geojson = await shp.parseZip(data);
        const reader = new JSZip();
        const contents = await reader.loadAsync(file);
        const files = [];
        const pairs: { [filename: string]: { shp: boolean, dbf: boolean } } = {};
        for (const file in contents.files) {
          const filename = file
          if (filename.endsWith('.shp') || filename.endsWith('.dbf')) {
            const splitFilename = filename.split('.');
            // @ts-expect-error
            const extension: "shp" | "dbf" = splitFilename.pop();
            const filenameWithoutExtension = splitFilename.join('.');
            if (pairs[filenameWithoutExtension]) {
              pairs[filenameWithoutExtension][extension] = true;
            } else {
              pairs[filenameWithoutExtension] = {
                shp: false,
                dbf: false
              }
              pairs[filenameWithoutExtension][extension] = true;
            }
            files.push(contents.files[file]);
          }
        }
        console.log(geojson)
        setFileEntries(files);
        setIsLoading(false);
        // Determine Contents
        // If file contains at least one valid .shp and .dbf file proceed to the next step and log errors
        // If file contains no valid .shp and .dbf files, log errors

      }
    } catch (e) {
      console.error(e);
    } finally {
      // setIsLoading(false);
      fileInputRef.current!.value = '';
    }
  };

  return (
    <View style={styles.container}>
      <Dialog isVisible={isLoading || !!fileEntries?.length} onDismiss={() => setIsLoading(false)}>
        <View style={styles.dialogContentContainer}>
          <Dialog.Title titleStyle={{ color: theme.colors.primary }} title={"Processing Field Boundaries"}></Dialog.Title>
          {isLoading && <ActivityIndicator animating={isLoading} size="large" color={theme.colors.primary} />}
          {fileEntries?.length && fileEntries.map((entry, index) => (
            <Text key={index}>{entry.name}</Text>
          ))}
          <Button title="Cancel" onPress={() => {
            setIsLoading(false)
            setFileEntries(null)
          }} />
        </View>
      </Dialog>

      <FieldUploadTabIcon focused={false} color={theme.colors.primary} size={50} />
      <Text h3 style={{ color: theme.colors.primary }}>Upload Field Boundaries</Text>
      <View style={styles.infoTextContainer}>
        <Text style={{ color: theme.colors.primary }}>Upload a ZIP file containing your field boundaries. </Text>
        <Text style={{ color: theme.colors.primary }}>This tool expects .shp and .dbf files with the same filename</Text>

      </View>
      <Button radius={10} raised title="Select ZIP File" onPress={handleButtonClick} icon={<MaterialIcons name="file-upload" color={theme.colors.secondary} size={24} />} />
      <View style={styles.infoTextContainer}>
        <Text style={{ color: theme.colors.primary }}>After successfull parsing, you will be asked to associate the boundaries to a Grower and Farm.</Text>
        <Text>Updating existing boundaries or creating a new field</Text>
      </View>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".zip"
        onChange={handleFileChange}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
  },
  dialogContentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  }
})
export default FieldUploadContainer;