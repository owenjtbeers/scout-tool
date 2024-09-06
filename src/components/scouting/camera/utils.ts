import type { Asset } from "expo-media-library";
import type { ScoutingReportForm } from "../types";
import type { ScoutingImage } from "../../../redux/scouting/types";
import type { UseFormGetValues, UseFormSetValue } from "react-hook-form";

/* Takes in a maybe saved to camera roll asset in case the user enables that */
export const setPhotoFormValue =
  (
    formGetValues: UseFormGetValues<ScoutingReportForm>,
    formSetValue: UseFormSetValue<ScoutingReportForm>,
    photoMetadata: ScoutingImage | null
  ) =>
  (uri: string, asset?: Asset): void => {
    let images = formGetValues(`images`);
    let newScoutImage = photoMetadata;
    if (!newScoutImage) {
      // default metadata
      newScoutImage = {
        ID: 0,
        ObservationAreaId: 0,
        WeedAliasId: 0,
        DiseaseAliasId: 0,
        InsectAliasId: 0,
        AddedById: 0,
        ObservationAreaUid: "",
        QuestionValId: 0,
        Url: asset?.uri || uri,
        Filename: asset?.filename || "",
        asset,
      };
    }
    // Destructure to cause the rest of the form to reupdate
    images = [
      ...images,
      {
        ...newScoutImage,
        Url: asset?.uri || uri,
        Filename: asset?.filename || "",
        asset,
      },
    ];
    formSetValue("images", images);
  };
