import { useState } from 'react';
import type { Player } from '../types/player';
import './Admin.css';

interface AdminProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onNavigateToMain: () => void;
}

function Admin({ players, onPlayersChange, onNavigateToMain }: AdminProps) {
  const [newPlayerName, setNewPlayerName] = useState('');

  const addPlayer = () => {
    const trimmedName = newPlayerName.trim();
    if (!trimmedName) {
      return; // Don't add if name is empty
    }
    
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: trimmedName,
      selectedTeams: {},
    };
    onPlayersChange([...players, newPlayer]);
    setNewPlayerName(''); // Clear input after adding
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={2} className="empty-state">
                  No players added yet. Enter a name below to add a player.
                </td>
              </tr>
            ) : (
              players.map(player => (
                <tr key={player.id}>
                  <td className="read-only-cell">{player.name}</td>
                  <td>
                    <button
                      onClick={() => deletePlayer(player.id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="add-player-section">
          <input
            type="text"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter player name..."
            className="player-name-input"
          />
          <button 
            onClick={addPlayer} 
            className="add-player-btn"
            disabled={!newPlayerName.trim()}
          >
            Add Player
          </button>
        </div>
      </div>
    </div>
  );
}

export default Admin;
