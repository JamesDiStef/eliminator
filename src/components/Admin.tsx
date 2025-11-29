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
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  const handleEditKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, playerId: string) => {
    if (e.key === 'Enter') {
      savePlayerName(playerId);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const startEdit = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditingName(player.name);
  };

  const savePlayerName = (playerId: string) => {
    const trimmedName = editingName.trim();
    if (!trimmedName) {
      cancelEdit();
      return;
    }
    
    const updatedPlayers = players.map(player =>
      player.id === playerId ? { ...player, name: trimmedName } : player
    );
    onPlayersChange(updatedPlayers);
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingPlayerId(null);
    setEditingName('');
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
                  <td>
                    {editingPlayerId === player.id ? (
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => handleEditKeyPress(e, player.id)}
                        onBlur={() => savePlayerName(player.id)}
                        className="edit-name-input"
                        autoFocus
                      />
                    ) : (
                      <div className="player-name-display">
                        <span>{player.name}</span>
                        <button
                          onClick={() => startEdit(player)}
                          className="edit-icon-btn"
                          aria-label="Edit player name"
                          title="Edit player name"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </td>
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
