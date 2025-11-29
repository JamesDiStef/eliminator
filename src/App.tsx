import { useState } from 'react';
import './App.css';
import { NFL_TEAMS, PREMIER_LEAGUE_TEAMS } from './data/leagues';
import type { Player } from './types/player';
import type { League } from './types/league';

function App() {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player 1', selectedTeams: {} },
  ]);

  const leagues: League[] = [NFL_TEAMS, PREMIER_LEAGUE_TEAMS];

  const handleTeamChange = (playerId: string, leagueId: string, teamId: string | null) => {
    setPlayers(players.map(player => {
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
    }));
  };

  const addPlayer = () => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      selectedTeams: {},
    };
    setPlayers([...players, newPlayer]);
  };

  const updatePlayerName = (playerId: string, name: string) => {
    setPlayers(players.map(player =>
      player.id === playerId ? { ...player, name } : player
    ));
  };

  return (
    <div className="app">
      <h1>Eliminator</h1>
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
            {players.map(player => (
              <tr key={player.id}>
                <td>
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => updatePlayerName(player.id, e.target.value)}
                    className="player-name-input"
                  />
                </td>
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
            ))}
          </tbody>
        </table>
        <button onClick={addPlayer} className="add-player-btn">
          Add Player
        </button>
      </div>
    </div>
  );
}

export default App;
