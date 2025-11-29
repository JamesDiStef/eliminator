import type { Player } from '../types/player';
import { NFL_TEAMS, PREMIER_LEAGUE_TEAMS } from '../data/leagues';
import type { League } from '../types/league';
import './MainPage.css';

interface MainPageProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onNavigateToAdmin: () => void;
}

function MainPage({ players, onPlayersChange, onNavigateToAdmin }: MainPageProps) {
  const leagues: League[] = [NFL_TEAMS, PREMIER_LEAGUE_TEAMS];

  const handleTeamChange = (playerId: string, leagueId: string, teamId: string | null) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          selectedTeams: {
            ...player.selectedTeams,
            [leagueId]: teamId,
          },
        };
      }
      return player;
    });
    onPlayersChange(updatedPlayers);
  };

  return (
    <div className="main-page">
      <div className="main-header">
        <h1>Eliminator</h1>
        <button onClick={onNavigateToAdmin} className="nav-button">
          Admin
        </button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Player Name</th>
              {leagues.map(league => (
                <th key={league.id}>{league.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={leagues.length + 1} className="empty-state">
                  No players added yet. Go to Admin to add players.
                </td>
              </tr>
            ) : (
              players.map(player => (
                <tr key={player.id}>
                  <td className="read-only-cell">{player.name}</td>
                  {leagues.map(league => (
                    <td key={league.id}>
                      <select
                        value={player.selectedTeams[league.id] || ''}
                        onChange={(e) => handleTeamChange(player.id, league.id, e.target.value || null)}
                        className="team-select"
                      >
                        <option value="">Select team...</option>
                        {league.teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainPage;
