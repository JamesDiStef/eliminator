export interface Player {
  id: string;
  name: string;
  selectedTeams: Record<string, string | null>; // leagueId -> teamId
}

