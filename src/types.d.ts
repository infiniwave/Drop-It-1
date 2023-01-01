export interface Profile {
  id: string;
  name: string;
  date: number;
  videoUrl: string;
  syncTime: number;
  [key: string];
}

export interface PrimedProfile extends Profile {
  id: string | null;
}
