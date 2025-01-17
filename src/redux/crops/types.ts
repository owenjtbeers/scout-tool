export type Crop = {
  ID: number;
  Name: string;
  DefaultColor: string;
};

export type OrgCrop = {
  ID: number;
  // These are just here for future purposes
  CropId?: number;
  Crop?: Crop;
  OrgId?: number;
  CreatedAt?: string;
  UpdatedAt?: string;
  Name: string;
  Color: string;
};

export type FieldCrop = {
  ID: number;
  FieldId: number;
  CropId: number;
  Crop: OrgCrop;
  PlantedDate: string;
  EndDate?: string;
};
