import { useState, useEffect } from 'react';
import './App.css';
import type { Player } from './types/player';
import MainPage from './components/MainPage';
import Admin from './components/Admin';

type Page = 'main' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const [players, setPlayers] = useState<Player[]>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('eliminator-players');
    if (saved) {
      try {
        return JSON.parse(saved);
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
