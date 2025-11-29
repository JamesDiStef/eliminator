import { useState } from 'react';
import type { Player } from '../types/player';
import { NFL_TEAMS, PREMIER_LEAGUE_TEAMS } from '../data/leagues';
import type { League } from '../types/league';
import './Admin.css';

interface AdminProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onNavigateToMain: () => void;
}

function Admin({ players, onPlayersChange, onNavigateToMain }: AdminProps) {
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

  const addPlayer = () => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      selectedTeams: {},
    };
    onPlayersChange([...players, newPlayer]);
  };

  const updatePlayerName = (playerId: string, name: string) => {
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, name } : player
    );
    onPlayersChange(updatedPlayers);
  };

  const deletePlayer = (playerId: string) => {
    const updatedPlayers = players.filter(player => player.id !== playerId);
    onPlayersChange(updatedPlayers);
  };

  return (
    <div className="admin">
      <div className="admin-header">
        <h1>Admin - Eliminator</h1>
        <button onClick={onNavigateToMain} className="nav-button">
          View Main Page
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
              <th>Actions</th>
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
                <td>
                  <button
                    onClick={() => deletePlayer(player.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
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

export default Admin;

