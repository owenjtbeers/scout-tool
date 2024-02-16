export type ScoutingAppUser = {
  id: string;
  username: string;
  email: string;
  role: "admin" | "user";
  team: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
  token: string
};