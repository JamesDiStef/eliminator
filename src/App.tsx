import { useState, useEffect } from 'react';
import './App.css';
import type { Player } from './types/player';
import MainPage from './components/MainPage';
import Admin from './components/Admin';

type Page = 'main' | 'admin';

// Migrate old data structure to new week-based structure
function migratePlayerData(players: any[]): Player[] {
  return players.map(player => {
    // Check if data is in old format (leagueId -> teamId) or new format (week -> leagueId -> teamId)
    if (!player.selectedTeams) {
      return { ...player, selectedTeams: {} };
    }
    
    // Check if first key is a number (week) or a string (leagueId)
    const firstKey = Object.keys(player.selectedTeams)[0];
    if (!firstKey) {
      return { ...player, selectedTeams: {} };
    }
    
    // If first key is a number, it's already in new format
    if (!isNaN(parseInt(firstKey, 10))) {
      return player as Player;
    }
    
    // Otherwise, migrate old format to new format (put all selections in week 1)
    const oldSelections = player.selectedTeams;
    return {
      ...player,
      selectedTeams: {
        '1': oldSelections,
      },
    };
  });
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const [players, setPlayers] = useState<Player[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('eliminator-players');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return migratePlayerData(parsed);
      } catch {
        return [{ id: '1', name: 'Player 1', selectedTeams: {} }];
      }
    }
    return [{ id: '1', name: 'Player 1', selectedTeams: {} }];
  });

  // Save to localStorage whenever players change
  useEffect(() => {
    localStorage.setItem('eliminator-players', JSON.stringify(players));
  }, [players]);

  return (
    <div className="app">
      {currentPage === 'main' ? (
        <MainPage
          players={players}
          onPlayersChange={setPlayers}
          onNavigateToAdmin={() => setCurrentPage('admin')}
        />
      ) : (
        <Admin
          players={players}
          onPlayersChange={setPlayers}
          onNavigateToMain={() => setCurrentPage('main')}
        />
      )}
    </div>
  );
}

export default App;
