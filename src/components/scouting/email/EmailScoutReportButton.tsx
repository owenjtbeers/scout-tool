import { MaterialIcons } from "@expo/vector-icons";
import { Button } from "@rneui/themed";
import * as FileSystem from "expo-file-system";
import * as MailComposer from "expo-mail-composer";
import * as Print from "expo-print";
import React from "react";
import { UseFormGetValues } from "react-hook-form";
import MapView from "react-native-maps";
import type { ScoutingReportForm } from "../types";
import { useGetCurrentUserQuery } from "../../../redux/user/userApi";
import type { ScoutingAppUser } from "../../../redux/user/types";
import { generateScoutingReportHtml } from "./generateScoutingReportHtml";
import { featureCollection, FeatureCollection } from "@turf/helpers";
import bbox from "@turf/bbox";


interface EmailButtonProps {
  mapRef: React.RefObject<MapView>;
  getFormValues: UseFormGetValues<ScoutingReportForm>;
}
export const EmailScoutReportButton = (props: EmailButtonProps) => {
  const { mapRef, getFormValues } = props;
  const [isProcessingEmail, setIsProcessingEmail] = React.useState(false);
  const { data: currentUserResponse } = useGetCurrentUserQuery("default");
  return (
    <Button
      icon={<MaterialIcons name={"email"} />}
      title={"Email"}
      loading={isProcessingEmail}
      onPress={async () => {
        try {
          // Get the current snapshot of the map
          setIsProcessingEmail(true);
          const fieldBoundary = getFormValues().field.ActiveBoundary
            ?.Json as FeatureCollection;
          const fc = featureCollection(fieldBoundary.features);
          const bboxOfFields = bbox(fc);
          // mapRef.current?.fitToCoordinates(
          //   convertTurfBBoxToLatLng(bboxOfFields),
          //   {
          //     animated: false,
          //     edgePadding: {
          //       top: 10,
          //       right: 10,
          //       bottom: 10,
          //       left: 10,
          //     },
          //   }
          // );

          // TODO: Figure out a better way to wait for the map to finish rendering from the fitToCoordinates
          // await new Promise((resolve) => setTimeout(resolve, 200));
          const user = currentUserResponse?.data;
          let mapScreenshotBase64 = "";
          if (mapRef?.current?.state?.isReady) {
            mapScreenshotBase64 = await mapRef.current.takeSnapshot({
              format: "jpg",
              result: "base64",
              quality: 0.3,
            });
          }

          const formValues = getFormValues();
          // Generate the scouting report HTML
          const reportHtml = await generateScoutingReportHtml(
            formValues,
            mapScreenshotBase64,
            user as ScoutingAppUser
          );
          // Generate new PDF
          const pdf = await Print.printToFileAsync({ html: reportHtml });

          // Rename PDF for user
          const pdfName = `${pdf.uri.slice(
            0,
            pdf.uri.lastIndexOf("/") + 1
          )}${formValues.scoutedDate.toDateString()}_${formValues.field.Name || "Field"
            }_scout_doc.pdf`.replaceAll(" ", "_");
          await FileSystem.moveAsync({
            from: pdf.uri,
            to: pdfName,
          });
          // Share the PDF via email
          const result = await MailComposer.composeAsync({
            recipients: formValues.growerEmail ? [formValues.growerEmail] : [],
            subject: `Scouting Report - ${formValues.field.Name
              } - ${formValues.scoutedDate.toDateString()}`,
            body: `Attached is a scouting report, by ${user?.Organization?.Name}.\n\n\n\n Powered by Grounded Agri-Tools`,
            attachments: [pdfName],
          });
          if (result.status === "sent") {
            // console.log("Email sent successfully");
          }
          setIsProcessingEmail(false);
        } catch (e) {
          console.warn(e);
        } finally {
          setIsProcessingEmail(false);
        }
      }}
    />
  );
};
