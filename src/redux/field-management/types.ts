export type Grower = {
  ID: number;
  Name: string;
};

export type Farm = {
  ID: number;
  Name: string;
  GrowerId: number;
  CreatedAt: string;
  UpdatedAt: string;
};
