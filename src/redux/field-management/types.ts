export type Grower = {
  ID: number;
  Name: string;
  Email: string;
};

export type Farm = {
  ID: number;
  Name: string;
  GrowerId: number;
};
