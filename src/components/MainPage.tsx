import { useState } from 'react';
import type { Player } from '../types/player';
import { NFL_TEAMS, PREMIER_LEAGUE_TEAMS } from '../data/leagues';
import type { League } from '../types/league';
import type { Team } from '../types/league';
import './MainPage.css';

interface MainPageProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onNavigateToAdmin: () => void;
}

const TOTAL_WEEKS = 18;

function MainPage({ players, onPlayersChange, onNavigateToAdmin }: MainPageProps) {
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const leagues: League[] = [NFL_TEAMS, PREMIER_LEAGUE_TEAMS];

  const handleTeamChange = (playerId: string, week: number, leagueId: string, teamId: string | null) => {
    const updatedPlayers = players.map(player => {
      if (player.id === playerId) {
        const weekKey = week.toString();
        const weekSelections = player.selectedTeams[weekKey] || {};
        return {
          ...player,
          selectedTeams: {
            ...player.selectedTeams,
            [weekKey]: {
              ...weekSelections,
              [leagueId]: teamId,
            },
          },
        };
      }
      return player;
    });
    onPlayersChange(updatedPlayers);
  };

  // Get teams that are already selected in other weeks for a specific player and league
  const getUsedTeamsForPlayer = (player: Player, leagueId: string, currentWeekNum: number): Set<string> => {
    const usedTeams = new Set<string>();
    Object.keys(player.selectedTeams).forEach(weekKey => {
      const weekNum = parseInt(weekKey, 10);
      if (weekNum !== currentWeekNum) {
        const teamId = player.selectedTeams[weekKey]?.[leagueId];
        if (teamId) {
          usedTeams.add(teamId);
        }
      }
    });
    return usedTeams;
  };

  // Get available teams for a player in a specific week and league
  const getAvailableTeams = (player: Player, league: League, week: number): Team[] => {
    const usedTeams = getUsedTeamsForPlayer(player, league.id, week);
    return league.teams.filter(team => !usedTeams.has(team.id));
  };

  const weekTabs = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);

  return (
    <div className="main-page">
      <div className="main-header">
        <h1>Eliminator</h1>
        <button onClick={onNavigateToAdmin} className="nav-button">
          Admin
        </button>
      </div>
      
      <div className="week-tabs">
        {weekTabs.map(week => (
          <button
            key={week}
            onClick={() => setCurrentWeek(week)}
            className={`week-tab ${currentWeek === week ? 'active' : ''}`}
          >
            Week {week}
          </button>
        ))}
      </div>

      <div className="table-container">
        <div className="week-header">
          <h2>Week {currentWeek}</h2>
        </div>
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
              players.map(player => {
                const weekKey = currentWeek.toString();
                const weekSelections = player.selectedTeams[weekKey] || {};
                
                return (
                  <tr key={player.id}>
                    <td className="read-only-cell">{player.name}</td>
                    {leagues.map(league => {
                      const availableTeams = getAvailableTeams(player, league, currentWeek);
                      const selectedTeamId = weekSelections[league.id] || '';
                      
                      return (
                        <td key={league.id}>
                          <select
                            value={selectedTeamId}
                            onChange={(e) => handleTeamChange(player.id, currentWeek, league.id, e.target.value || null)}
                            className="team-select"
                          >
                            <option value="">Select team...</option>
                            {availableTeams.map(team => (
                              <option key={team.id} value={team.id}>
                                {team.name}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainPage;
