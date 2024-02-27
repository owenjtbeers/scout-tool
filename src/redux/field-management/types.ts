export type Grower = {
  ID: string;
  Name: string;
};

export type Farm = {
  ID: string;
  Name: string;
  GrowerId: string;
  CreatedAt: string;
  UpdatedAt: string;
};
