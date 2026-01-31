import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { generateBracket } from './bracketUtils';

const API_URL = 'http://localhost:8080/api';

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

  // Bracket Creator State
  const [bracketSize, setBracketSize] = useState(4);
  const [bracketParticipants, setBracketParticipants] = useState(Array(4).fill(''));
  const [generatedBracket, setGeneratedBracket] = useState(null);

  const formatSizes = {
    '1v1': 1,
    '2v2': 2,
    '3v3': 3,
    '5v5': 5
  };

  const seriesTypes = ['BO1', 'BO3', 'BO5', 'Unlimited'];

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [playersRes, matchesRes] = await Promise.all([
        axios.get(`${API_URL}/players`),
        axios.get(`${API_URL}/matches`)
      ]);
      setPlayers(playersRes.data);
      setMatches(matchesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Cannot connect to backend! Make sure Spring Boot is running on port 8080');
    }
  };

  // Player Management
  const createPlayer = async () => {
    if (!newPlayerNick.trim()) return;

    try {
      await axios.post(`${API_URL}/players`, { nick: newPlayerNick.trim() });
      setNewPlayerNick('');
      fetchData();
    } catch (error) {
      console.error('Error creating player:', error);
      alert('Error creating player');
    }
  };

  const deletePlayer = async (id) => {
    try {
      await axios.delete(`${API_URL}/players/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Error deleting player');
    }
  };

  // Match Creation - Add by input
  const addPlayerByInput = async (team) => {
    const input = team === 'A' ? teamAInput : teamBInput;
    if (!input.trim()) return;

    const maxSize = formatSizes[matchFormat];
    const currentTeam = team === 'A' ? teamAPlayers : teamBPlayers;

    if (currentTeam.length >= maxSize) {
      alert(`Team ${team} is full! (${maxSize}/${maxSize})`);
      return;
    }

    const playerNick = input.trim();
    let existingPlayer = players.find(p => p.nick.toLowerCase() === playerNick.toLowerCase());

    // Create player in DB if doesn't exist
    if (!existingPlayer) {
      try {
        const response = await axios.post(`${API_URL}/players`, { nick: playerNick });
        existingPlayer = response.data;
        setPlayers([...players, existingPlayer]);
      } catch (error) {
        console.error('Error creating player:', error);
        alert('Error creating player');
        return;
      }
    }

    // Add to team
    if (team === 'A') {
      setTeamAPlayers([...teamAPlayers, existingPlayer]);
      setTeamAInput('');
    } else {
      setTeamBPlayers([...teamBPlayers, existingPlayer]);
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

  const createMatch = async () => {
    if (!matchFormat || !seriesType) {
      alert('Please select match format and series type!');
      return;
    }

    const maxSize = formatSizes[matchFormat];

    if (teamAPlayers.length !== maxSize || teamBPlayers.length !== maxSize) {
      alert(`Both teams must have exactly ${maxSize} player(s) for ${matchFormat} format!`);
      return;
    }

    try {
      await axios.post(`${API_URL}/matches`, {
        format: matchFormat,
        seriesType: seriesType,
        teamA: teamAPlayers.map(p => p.nick),
        teamB: teamBPlayers.map(p => p.nick)
      });

      setTeamAPlayers([]);
      setTeamBPlayers([]);
      setSelectedPlayer('');
      setMatchFormat('');
      setSeriesType('');
      setTeamAInput('');
      setTeamBInput('');
      alert('Match created! 🎮');
      fetchData();
    } catch (error) {
      console.error('Error creating match:', error);
      alert('Error creating match');
    }
  };

  const updateScore = async (matchId, team, value) => {
    const match = matches.find(m => m.id === matchId);
    if (!match) return;

    let scoreA = team === 'A' ? (parseInt(value) || 0) : match.scoreA;
    let scoreB = team === 'B' ? (parseInt(value) || 0) : match.scoreB;

    // Prevent negative scores
    scoreA = Math.max(0, scoreA);
    scoreB = Math.max(0, scoreB);

    // Check for win condition
    let winner = null;
    let seriesType = match.seriesType || 'BO3'; // Default to BO3 if not set
    let gamesToWin = 0;

    if (seriesType === 'BO1') gamesToWin = 1;
    else if (seriesType === 'BO3') gamesToWin = 2;
    else if (seriesType === 'BO5') gamesToWin = 3;
    else if (seriesType === 'Unlimited') gamesToWin = 999;

    if (scoreA >= gamesToWin) {
        winner = match.teamA.join(', '); // Simplified: taking team name
        // Cap score if needed, but usually we let it be
    } else if (scoreB >= gamesToWin) {
        winner = match.teamB.join(', ');
    }

    try {
      // Need backend support for updating winner directly via score endpoint or separate
      // Assuming existing backend logic might calculate winner, but if we want to enforce it here:
      // We might need a separate call or specific payload.
      // For now, let's just update score. If the backend handles winner, great.
      // If we need to display it locally based on score, we can do it in the render.
      // But the user asked to SHOW winner only if condition met.
      // So we will optimistic update local state to show it.

      const response = await axios.patch(`${API_URL}/matches/${matchId}/score`, { scoreA, scoreB });
      // If backend returns the updated match which includes winner
      // setMatches(matches.map(m => m.id === matchId ? response.data : m));
      // Re-fetch to be safe and get backend's view on winner
      fetchData();
    } catch (error) {
      console.error('Error updating score:', error);
      alert('Error updating score');
    }
  };

  const deleteMatch = async (id) => {
    try {
      await axios.delete(`${API_URL}/matches/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting match:', error);
      alert('Error deleting match');
    }
  };

  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to delete ALL data? (players + matches)')) {
      try {
        for (const match of matches) {
          await axios.delete(`${API_URL}/matches/${match.id}`);
        }
        for (const player of players) {
          await axios.delete(`${API_URL}/players/${player.id}`);
        }

        setPlayers([]);
        setMatches([]);
        setTeamAPlayers([]);
        setTeamBPlayers([]);
        setBracketParticipants(Array(bracketSize).fill(''));
        alert('All data cleared! 🗑️');
        fetchData();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Error clearing data');
      }
    }
  };

  // Bracket Functions
  const handleBracketSizeChange = (size) => {
    setBracketSize(size);
    // Preserve existing names if possible when resizing, or reset? Reset is safer for now to avoid confusion with indices
    const current = [...bracketParticipants];
    const newParticipants = Array(size).fill('').map((_, i) => current[i] || '');
    setBracketParticipants(newParticipants);
  };

  useEffect(() => {
    const savedBracket = localStorage.getItem('tournamentBracket');
    if (savedBracket) {
      setGeneratedBracket(JSON.parse(savedBracket));
    }
  }, []);

  const handleParticipantChange = (index, value) => {
    const newParticipants = [...bracketParticipants];
    newParticipants[index] = value;
    setBracketParticipants(newParticipants);
  };

  const availablePlayers = players.filter(p =>
    !teamAPlayers.find(tp => tp.id === p.id) &&
    !teamBPlayers.find(tp => tp.id === p.id)
  );

  // Helper function to determine if there's a winner based on series type
  const getMatchWinner = (match) => {
    if (!match) return null;

    const seriesType = match.seriesType || 'BO3';
    let gamesToWin = 0;

    if (seriesType === 'BO1') gamesToWin = 1;
    else if (seriesType === 'BO3') gamesToWin = 2;
    else if (seriesType === 'BO5') gamesToWin = 3;
    else if (seriesType === 'Unlimited') return null; // Never declare winner for Unlimited

    const scoreA = match.scoreA || 0;
    const scoreB = match.scoreB || 0;

    if (scoreA >= gamesToWin) {
      return match.teamA.join(', ');
    } else if (scoreB >= gamesToWin) {
      return match.teamB.join(', ');
    }

    return null;
  };

  const handleGenerateBracket = () => {
     // Validate
     if (bracketParticipants.some(p => !p.trim())) {
        alert('Please fill in all participant names!');
        return;
     }
     const newBracket = generateBracket(bracketParticipants);
     setGeneratedBracket(newBracket);
     localStorage.setItem('tournamentBracket', JSON.stringify(newBracket));
  };

  const handleBracketWin = (roundIndex, matchIndex, winnerName) => {
      const newBracket = [...generatedBracket];
      const match = newBracket[roundIndex][matchIndex];
      match.winner = winnerName;

      // Propagate to next round
      if (match.nextMatchId) {
          // Find next match
          // Since roundIndex + 1 is the next round array
          const nextRound = newBracket[roundIndex + 1];
          const nextMatch = nextRound.find(m => m.id === match.nextMatchId);

          if (nextMatch) {
              // Determine if it should be player1 or player2
              // Logic: matchIndex is even -> player1 slot, odd -> player2 slot in next match
              // Wait, my generation logic was: i*2 goes to next match.
              // matchIndex 0 and 1 -> nextMatchIndex 0
              if (matchIndex % 2 === 0) {
                  nextMatch.player1 = winnerName;
              } else {
                  nextMatch.player2 = winnerName;
              }
              // Reset winner of next match if it was already decided (in case of changing history)
              nextMatch.winner = null;
              // Clear subsequent if needed... simple for now.
          }
      }
      setGeneratedBracket(newBracket);
      localStorage.setItem('tournamentBracket', JSON.stringify(newBracket));
  };

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
            className={view === 'bracketCreator' ? 'active' : ''}
            onClick={() => setView('bracketCreator')}
          >
            🏆 Bracket Creator
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

        {view === 'bracketCreator' && (
          <div className="bracket-creator">
            <h2>🏆 Bracket Creator</h2>

            <div className="bracket-setup">
              <div className="setup-section">
                <h3>1. Choose Size</h3>
                <div className="size-buttons">
                  {[2, 4, 8, 16].map(size => (
                    <button
                      key={size}
                      className={bracketSize === size ? 'active' : ''}
                      onClick={() => handleBracketSizeChange(size)}
                    >
                      {size} Teams
                    </button>
                  ))}
                </div>
              </div>

              <div className="setup-section">
                <h3>2. Add Participants</h3>
                <div className="participants-grid">
                  {bracketParticipants.map((name, index) => (
                    <div key={index} className="participant-input-group">
                      <span className="seed">#{index + 1}</span>
                      <input
                        type="text"
                        placeholder={`Name/Team ${index + 1}`}
                        value={name}
                        onChange={(e) => handleParticipantChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button className="create-match-btn" onClick={handleGenerateBracket}>
                 Generate Bracket
              </button>

              {generatedBracket && (
                  <div className="bracket-display">
                    <h3>🏆 Tournament Bracket</h3>
                    <div className="bracket-rounds">
                        {generatedBracket.map((round, rIndex) => (
                            <div key={rIndex} className="bracket-round">
                                <h4>Round {rIndex + 1}</h4>
                                {round.map((match, mIndex) => (
                                    <div key={match.id} className="bracket-match">
                                        <div className={`bracket-player ${match.winner === match.player1 ? 'winner' : ''} ${!match.player1 ? 'tbd' : ''}`}>
                                            <span>{match.player1 || 'TBD'}</span>
                                            {match.player1 && !match.winner && (
                                                <button onClick={() => handleBracketWin(rIndex, mIndex, match.player1)}>Win</button>
                                            )}
                                        </div>
                                        <div className={`bracket-player ${match.winner === match.player2 ? 'winner' : ''} ${!match.player2 ? 'tbd' : ''}`}>
                                            <span>{match.player2 || 'TBD'}</span>
                                            {match.player2 && !match.winner && (
                                                <button onClick={() => handleBracketWin(rIndex, mIndex, match.player2)}>Win</button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                  </div>
              )}
            </div>
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
                        <div className="score-input-group">
                          <input
                            type="number"
                            min="0"
                            value={match.scoreA}
                            onChange={(e) => updateScore(match.id, 'A', e.target.value)}
                          />
                          <div className="score-controls">
                            <button onClick={() => updateScore(match.id, 'A', (match.scoreA || 0) - 1)} className="score-btn minus">-</button>
                            <button onClick={() => updateScore(match.id, 'A', (match.scoreA || 0) + 1)} className="score-btn plus">+</button>
                          </div>
                        </div>
                        <span className="sc-divider">:</span>
                        <div className="score-input-group">
                          <input
                            type="number"
                            min="0"
                            value={match.scoreB}
                            onChange={(e) => updateScore(match.id, 'B', e.target.value)}
                          />
                          <div className="score-controls">
                            <button onClick={() => updateScore(match.id, 'B', (match.scoreB || 0) - 1)} className="score-btn minus">-</button>
                            <button onClick={() => updateScore(match.id, 'B', (match.scoreB || 0) + 1)} className="score-btn plus">+</button>
                          </div>
                        </div>
                      </div>

                      <div className="team-side">
                        <strong>Team B:</strong>
                        <p>{match.teamB.join(', ')}</p>
                      </div>
                    </div>

                    {getMatchWinner(match) && (
                      <div className="winner-badge">
                        🏆 Winner: {getMatchWinner(match)}
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
        <p>💾 Data saved locally in browser | Backend: localhost:8080 | Frontend: localhost:3000</p>
      </footer>
    </div>
  );
}

export default App;
