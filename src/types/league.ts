export interface Team {
  id: string;
  name: string;
}

export interface League {
  id: string;
  name: string;
  teams: Team[];
}

