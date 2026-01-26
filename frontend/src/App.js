import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const [matchFormat, setMatchFormat] = useState('');
  const [seriesType, setSeriesType] = useState('');
  const [teamAPlayers, setTeamAPlayers] = useState([]);
  const [teamBPlayers, setTeamBPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const [newPlayerNick, setNewPlayerNick] = useState('');
  const [teamAInput, setTeamAInput] = useState('');
  const [teamBInput, setTeamBInput] = useState('');
  const [view, setView] = useState('matchCreator');

  const formatSizes = {
    '1v1': 1,
    '2v2': 2,
    '3v3': 3,
    '5v5': 5
  };

  const seriesTypes = ['BO1', 'BO3', 'BO5', 'Unlimited'];

  // Load from LocalStorage
  useEffect(() => {
    const savedPlayers = localStorage.getItem('players');
    const savedMatches = localStorage.getItem('matches');

    if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
    if (savedMatches) setMatches(JSON.parse(savedMatches));
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

  // Player Management
  const createPlayer = () => {
    if (!newPlayerNick.trim()) return;

    const newPlayer = {
      id: Date.now(),
      nick: newPlayerNick.trim()
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerNick('');
  };

  const deletePlayer = (id) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  // Match Creation - Add by input
  const addPlayerByInput = (team) => {
    const input = team === 'A' ? teamAInput : teamBInput;
    if (!input.trim()) return;

    const maxSize = formatSizes[matchFormat];
    const currentTeam = team === 'A' ? teamAPlayers : teamBPlayers;

    if (currentTeam.length >= maxSize) {
      alert(`Team ${team} is full! (${maxSize}/${maxSize})`);
      return;
    }

    const newPlayer = {
      id: Date.now() + Math.random(),
      nick: input.trim()
    };

    // Add to players list if doesn't exist
    if (!players.find(p => p.nick.toLowerCase() === input.trim().toLowerCase())) {
      setPlayers([...players, newPlayer]);
    }

    // Add to team
    if (team === 'A') {
      setTeamAPlayers([...teamAPlayers, newPlayer]);
      setTeamAInput('');
    } else {
      setTeamBPlayers([...teamBPlayers, newPlayer]);
      setTeamBInput('');
    }
  };

  const removePlayerFromTeam = (team, playerId) => {
    if (team === 'A') {
      setTeamAPlayers(teamAPlayers.filter(p => p.id !== playerId));
    } else {
      setTeamBPlayers(teamBPlayers.filter(p => p.id !== playerId));
    }
  };

  const createMatch = () => {
    if (!matchFormat || !seriesType) {
      alert('Please select match format and series type!');
      return;
    }

    const maxSize = formatSizes[matchFormat];

    if (teamAPlayers.length !== maxSize || teamBPlayers.length !== maxSize) {
      alert(`Both teams must have exactly ${maxSize} player(s) for ${matchFormat} format!`);
      return;
    }

    const newMatch = {
      id: Date.now(),
      format: matchFormat,
      seriesType: seriesType,
      teamA: teamAPlayers.map(p => p.nick),
      teamB: teamBPlayers.map(p => p.nick),
      scoreA: 0,
      scoreB: 0,
      winner: null,
      createdAt: new Date().toLocaleString('en-US')
    };

    setMatches([newMatch, ...matches]);
    setTeamAPlayers([]);
    setTeamBPlayers([]);
    setSelectedPlayer('');
    setMatchFormat('');
    setSeriesType('');
    setTeamAInput('');
    setTeamBInput('');
    alert('Match created! 🎮');
  };

  const updateScore = (matchId, team, value) => {
    setMatches(matches.map(match => {
      if (match.id === matchId) {
        const newMatch = { ...match };
        if (team === 'A') newMatch.scoreA = parseInt(value) || 0;
        else newMatch.scoreB = parseInt(value) || 0;

        // Determine winner
        if (newMatch.scoreA > newMatch.scoreB) {
          newMatch.winner = 'Team A';
        } else if (newMatch.scoreB > newMatch.scoreA) {
          newMatch.winner = 'Team B';
        } else {
          newMatch.winner = null;
        }

        return newMatch;
      }
      return match;
    }));
  };

  const deleteMatch = (id) => {
    setMatches(matches.filter(m => m.id !== id));
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to delete ALL data? (players + matches)')) {
      setPlayers([]);
      setMatches([]);
      setTeamAPlayers([]);
      setTeamBPlayers([]);
      localStorage.clear();
      alert('All data cleared! 🗑️');
    }
  };

  const availablePlayers = players.filter(p =>
    !teamAPlayers.find(tp => tp.id === p.id) &&
    !teamBPlayers.find(tp => tp.id === p.id)
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>🎮 Match Creator</h1>
        <p className="subtitle">Quick match creation system</p>
        <nav className="nav-tabs">
          <button
            className={view === 'matchCreator' ? 'active' : ''}
            onClick={() => setView('matchCreator')}
          >
            🎯 Create Match
          </button>
          <button
            className={view === 'playerManager' ? 'active' : ''}
            onClick={() => setView('playerManager')}
          >
            👥 Players ({players.length})
          </button>
          <button
            className={view === 'matches' ? 'active' : ''}
            onClick={() => setView('matches')}
          >
            📋 Matches ({matches.length})
          </button>
        </nav>
      </header>

      <main className="container">
        {view === 'matchCreator' && (
          <div className="match-creator">
            <h2>Create Match</h2>

            {/* STEP 1: Select Format */}
            <div className="format-selector">
              <h3>⚡ Step 1: Select Match Format</h3>
              <div className="format-buttons">
                {Object.keys(formatSizes).map(format => (
                  <button
                    key={format}
                    className={matchFormat === format ? 'active' : ''}
                    onClick={() => {
                      setMatchFormat(format);
                      setSeriesType('');
                      setTeamAPlayers([]);
                      setTeamBPlayers([]);
                      setTeamAInput('');
                      setTeamBInput('');
                    }}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2: Select Series Type */}
            {matchFormat && (
              <div className="series-selector">
                <h3>🎯 Step 2: Select Series Type</h3>
                <div className="series-buttons">
                  {seriesTypes.map(series => (
                    <button
                      key={series}
                      className={seriesType === series ? 'active' : ''}
                      onClick={() => setSeriesType(series)}
                    >
                      {series}
                    </button>
                  ))}
                </div>
                <p className="series-info">
                  {seriesType === 'BO1' && '📌 Best of 1 - First to win 1 game'}
                  {seriesType === 'BO3' && '📌 Best of 3 - First to win 2 games'}
                  {seriesType === 'BO5' && '📌 Best of 5 - First to win 3 games'}
                  {seriesType === 'Unlimited' && '📌 Unlimited - Play as much as you want!'}
                </p>
              </div>
            )}

            {/* STEP 3: Add Players */}
            {!matchFormat || !seriesType ? (
              <div className="empty-state">
                <p>👆 First select match format and series type</p>
              </div>
            ) : (
              <>
                <div className="match-summary">
                  <h3>👥 Step 3: Add Players to Teams</h3>
                  <div className="selected-options">
                    <span className="badge">Format: {matchFormat}</span>
                    <span className="badge">Series: {seriesType}</span>
                  </div>
                </div>

                <div className="teams-container">
                  <div className="team-box">
                    <h3>Team A ({teamAPlayers.length}/{formatSizes[matchFormat]})</h3>

                    <div className="inline-add">
                      <input
                        type="text"
                        placeholder="Enter player name..."
                        value={teamAInput}
                        onChange={(e) => setTeamAInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addPlayerByInput('A')}
                        disabled={teamAPlayers.length >= formatSizes[matchFormat]}
                      />
                      <button
                        onClick={() => addPlayerByInput('A')}
                        disabled={!teamAInput.trim() || teamAPlayers.length >= formatSizes[matchFormat]}
                        className="add-btn"
                      >
                        +
                      </button>
                    </div>

                    <ul className="player-list">
                      {teamAPlayers.map(player => (
                        <li key={player.id}>
                          {player.nick}
                          <button onClick={() => removePlayerFromTeam('A', player.id)}>✕</button>
                        </li>
                      ))}
                      {teamAPlayers.length === 0 && <li className="empty">No players yet</li>}
                    </ul>
                  </div>

                  <div className="vs-divider">VS</div>

                  <div className="team-box">
                    <h3>Team B ({teamBPlayers.length}/{formatSizes[matchFormat]})</h3>

                    <div className="inline-add">
                      <input
                        type="text"
                        placeholder="Enter player name..."
                        value={teamBInput}
                        onChange={(e) => setTeamBInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addPlayerByInput('B')}
                        disabled={teamBPlayers.length >= formatSizes[matchFormat]}
                      />
                      <button
                        onClick={() => addPlayerByInput('B')}
                        disabled={!teamBInput.trim() || teamBPlayers.length >= formatSizes[matchFormat]}
                        className="add-btn"
                      >
                        +
                      </button>
                    </div>

                    <ul className="player-list">
                      {teamBPlayers.map(player => (
                        <li key={player.id}>
                          {player.nick}
                          <button onClick={() => removePlayerFromTeam('B', player.id)}>✕</button>
                        </li>
                      ))}
                      {teamBPlayers.length === 0 && <li className="empty">No players yet</li>}
                    </ul>
                  </div>
                </div>

                <button
                  className="create-match-btn"
                  onClick={createMatch}
                  disabled={teamAPlayers.length !== formatSizes[matchFormat] || teamBPlayers.length !== formatSizes[matchFormat]}
                >
                  🎮 Create Match!
                </button>
              </>
            )}
          </div>
        )}

        {view === 'playerManager' && (
          <div className="manager-section">
            <h2>Manage Players</h2>

            <div className="create-form">
              <input
                type="text"
                placeholder="Player name (e.g. Faker, Caps, Jankos)"
                value={newPlayerNick}
                onChange={(e) => setNewPlayerNick(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && createPlayer()}
              />
              <button onClick={createPlayer}>Add Player</button>
            </div>

            {players.length === 0 ? (
              <div className="empty-state">
                <p>😢 No players yet. Add your first player above!</p>
              </div>
            ) : (
              <ul className="item-list">
                {players.map(player => (
                  <li key={player.id}>
                    <span>👤 {player.nick}</span>
                    <button onClick={() => deletePlayer(player.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            )}

            <div className="danger-zone">
              <button className="danger-btn" onClick={clearAllData}>
                🗑️ Clear All Data
              </button>
            </div>
          </div>
        )}

        {view === 'matches' && (
          <div className="matches-section">
            <h2>Match History</h2>

            {matches.length === 0 ? (
              <div className="empty-state">
                <p>📋 No matches yet. Create your first match!</p>
                <button onClick={() => setView('matchCreator')}>Create Match</button>
              </div>
            ) : (
              <ul className="matches-list">
                {matches.map(match => (
                  <li key={match.id} className="match-item">
                    <div className="match-header">
                      <div className="match-badges">
                        <span className="match-format">{match.format}</span>
                        <span className="match-series">{match.seriesType || 'BO3'}</span>
                      </div>
                      <span className="match-date">{match.createdAt}</span>
                      <button className="delete-btn" onClick={() => deleteMatch(match.id)}>✕</button>
                    </div>

                    <div className="match-teams">
                      <div className="team-side">
                        <strong>Team A:</strong>
                        <p>{match.teamA.join(', ')}</p>
                      </div>

                      <div className="match-score">
                        <input
                          type="number"
                          min="0"
                          value={match.scoreA}
                          onChange={(e) => updateScore(match.id, 'A', e.target.value)}
                        />
                        <span>:</span>
                        <input
                          type="number"
                          min="0"
                          value={match.scoreB}
                          onChange={(e) => updateScore(match.id, 'B', e.target.value)}
                        />
                      </div>

                      <div className="team-side">
                        <strong>Team B:</strong>
                        <p>{match.teamB.join(', ')}</p>
                      </div>
                    </div>

                    {match.winner && (
                      <div className="winner-badge">
                        🏆 Winner: {match.winner}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>💾 Data saved locally in browser</p>
      </footer>
    </div>
  );
}

export default App;

