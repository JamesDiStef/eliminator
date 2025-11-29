// selectedTeams structure: week -> leagueId -> teamId
// Example: { "1": { "nfl": "phi", "premier-league": "ars" }, "2": { "nfl": "dal", "premier-league": "liv" } }
export interface Player {
  id: string;
  name: string;
  selectedTeams: Record<string, Record<string, string | null>>; // week -> leagueId -> teamId
}
