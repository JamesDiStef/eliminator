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

type ViewMode = 'selections' | 'all-selections';

function MainPage({ players, onPlayersChange, onNavigateToAdmin }: MainPageProps) {
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('selections');
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

  // Get team name by ID
  const getTeamName = (leagueId: string, teamId: string | null | undefined): string => {
    if (!teamId) return '-';
    const league = leagues.find(l => l.id === leagueId);
    const team = league?.teams.find(t => t.id === teamId);
    return team?.name || '-';
  };

  const goToPreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const goToNextWeek = () => {
    if (currentWeek < TOTAL_WEEKS) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  const renderSelectionsView = () => (
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
  );

  const renderAllSelectionsView = () => {
    const weekNumbers = Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1);
    
    return (
      <div className="table-container all-selections-container">
        <table className="all-selections-table">
          <thead>
            <tr>
              <th rowSpan={2}>Player</th>
              {weekNumbers.map(week => (
                <th key={week} colSpan={leagues.length} className="week-header-cell">
                  Week {week}
                </th>
              ))}
            </tr>
            <tr>
              {weekNumbers.map(week => 
                leagues.map(league => (
                  <th key={`${week}-${league.id}`} className="league-header-cell">
                    {league.name}
                  </th>
                ))
              )}
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={1 + TOTAL_WEEKS * leagues.length} className="empty-state">
                  No players added yet. Go to Admin to add players.
                </td>
              </tr>
            ) : (
              players.map(player => (
                <tr key={player.id}>
                  <td className="read-only-cell player-name-cell">{player.name}</td>
                  {weekNumbers.map(week => {
                    const weekKey = week.toString();
                    const weekSelections = player.selectedTeams[weekKey] || {};
                    return leagues.map(league => (
                      <td key={`${week}-${league.id}`} className="read-only-cell">
                        {getTeamName(league.id, weekSelections[league.id])}
                      </td>
                    ));
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="main-page">
      <div className="main-header">
        <h1>Eliminator</h1>
        <button onClick={onNavigateToAdmin} className="nav-button">
          Admin
        </button>
      </div>
      
      <div className="view-tabs">
        <button
          onClick={() => setViewMode('selections')}
          className={`view-tab ${viewMode === 'selections' ? 'active' : ''}`}
        >
          Selections
        </button>
        <button
          onClick={() => setViewMode('all-selections')}
          className={`view-tab ${viewMode === 'all-selections' ? 'active' : ''}`}
        >
          All Selections
        </button>
      </div>

      {viewMode === 'selections' ? renderSelectionsView() : renderAllSelectionsView()}

      {viewMode === 'selections' && (
        <div className="week-stepper">
          <button
            onClick={goToPreviousWeek}
            disabled={currentWeek === 1}
            className="stepper-button"
            aria-label="Previous week"
          >
            ←
          </button>
          <div className="week-numbers">
            {Array.from({ length: TOTAL_WEEKS }, (_, i) => i + 1).map(week => (
              <button
                key={week}
                onClick={() => setCurrentWeek(week)}
                className={`week-number ${currentWeek === week ? 'active' : ''}`}
              >
                {week}
              </button>
            ))}
          </div>
          <button
            onClick={goToNextWeek}
            disabled={currentWeek === TOTAL_WEEKS}
            className="stepper-button"
            aria-label="Next week"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default MainPage;
