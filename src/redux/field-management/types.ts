export type Grower = {
  id: string;
  name: string;
};

export type Farm = {
  id: string;
  name: string;
  growerId: string;
  createdAt: string;
  updatedAt: string;
};