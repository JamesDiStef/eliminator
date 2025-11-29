import type { Player } from '../types/player';
import './Admin.css';

interface AdminProps {
  players: Player[];
  onPlayersChange: (players: Player[]) => void;
  onNavigateToMain: () => void;
}

function Admin({ players, onPlayersChange, onNavigateToMain }: AdminProps) {
  const addPlayer = () => {
    const newPlayer: Player = {
      id: Date.now().toString(),
      name: `Player ${players.length + 1}`,
      selectedTeams: {},
    };
    onPlayersChange([...players, newPlayer]);
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
                  No players added yet. Click "Add Player" to get started.
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
        <button onClick={addPlayer} className="add-player-btn">
          Add Player
        </button>
      </div>
    </div>
  );
}

export default Admin;
