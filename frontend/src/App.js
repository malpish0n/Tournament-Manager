import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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

    const scoreA = team === 'A' ? (parseInt(value) || 0) : match.scoreA;
    const scoreB = team === 'B' ? (parseInt(value) || 0) : match.scoreB;

    try {
      await axios.patch(`${API_URL}/matches/${matchId}/score`, { scoreA, scoreB });
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
        alert('All data cleared! 🗑️');
        fetchData();
      } catch (error) {
        console.error('Error clearing data:', error);
        alert('Error clearing data');
      }
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
        <p>💾 Data saved in PostgreSQL | Backend: localhost:8080 | Frontend: localhost:3000</p>
      </footer>
    </div>
  );
}

export default App;
