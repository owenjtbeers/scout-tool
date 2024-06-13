import type { ScoutingImage } from "../../redux/scouting/types";


/*
  * Uploads the images to S3
  * @param imageUploads - The images to upload. This is the response from the server
  * which includes a URL to upload the image to
  * @param formImages - The images from the form. This is the image that will be uploaded
*/
export async function postScoutingImagesAsync(
  imageUploads: ScoutingImage[],
  formImages: ScoutingImage[]
) {
  // Grab the image from the form that matches the one in imageUploads
  await formImages.map(async (formImage) => {
    const uploadImage = imageUploads.find(
      (responseImage) => formImage.Filename === responseImage.Filename
    );
    if (uploadImage && uploadImage.UploadLink) {
      await uploadToS3(uploadImage.UploadLink, formImage.Url, uploadImage.Filename as string, "image/jpeg");
    } else {
      console.error("Failed to get a link from the server for image upload");
    }
  });
}

/*
  * Uploads the image to S3
  * @param uploadLink - The link to upload the image to
  * @param imageUrl - The image URL to upload
  * @param imageFilename - The image filename
  * @param imageFileType - The image file type "image/jpeg"
*/
export async function uploadToS3(uploadLink: string, imageUrl: string, imageFilename: string, imageFileType: string) {
  const xhr = new XMLHttpRequest();
  xhr.open("PUT", uploadLink, true);
  xhr.onprogress = async (event) => {
    console.log("Upload progress", `${event.loaded} of ${event.total}`);
  };
  xhr.onload = async () => {
    console.log(`Loaded: ${xhr.status} ${xhr.response}`);
  };
  // Prep the blob data
  const blobResponse = await fetch(imageUrl);
  const blob = await blobResponse.blob();
  const imageData = new File([blob], imageFilename);
  // Upload the Blob data
  xhr.setRequestHeader("Content-Type", imageFileType);

  // Send the request
  await xhr.send(imageData);
}