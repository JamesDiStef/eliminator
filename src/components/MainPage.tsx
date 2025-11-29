import type { Player } from '../types/player';
import { NFL_TEAMS, PREMIER_LEAGUE_TEAMS } from '../data/leagues';
import type { League } from '../types/league';
import './MainPage.css';

interface MainPageProps {
  players: Player[];
  onNavigateToAdmin: () => void;
}

function MainPage({ players, onNavigateToAdmin }: MainPageProps) {
  const leagues: League[] = [NFL_TEAMS, PREMIER_LEAGUE_TEAMS];

  const getTeamName = (leagueId: string, teamId: string | null | undefined): string => {
    if (!teamId) return '-';
    const league = leagues.find(l => l.id === leagueId);
    const team = league?.teams.find(t => t.id === teamId);
    return team?.name || '-';
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
                    <td key={league.id} className="read-only-cell">
                      {getTeamName(league.id, player.selectedTeams[league.id])}
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

