import React, { useState, useEffect } from 'react';

const TournamentBracket = ({ teams = [], matches = [], onWin }) => {
  const incomingSize = teams.length;
  // Determine closest power of 2 size
  const size = [4, 8, 16].includes(incomingSize) ? incomingSize : (incomingSize > 8 ? 16 : (incomingSize > 4 ? 8 : 4));

  const safeTeams = [...teams, ...Array(size).fill('TBD')].slice(0, size);

  const boxWidth = 180;
  const boxHeight = 50;
  const pairGap = 30; // Gap between teams in a pair
  const matchGap = 50; // Gap between different pairs
  const connectorWidth = 80; // Horizontal distance between rounds

  const padding = 50;
  const totalRounds = Math.log2(size);

  // Calculate required canvas dimensions
  // Width: Padding + TeamColumn + N * (Connector + MatchColumn) + Padding
  const width = padding * 2 + boxWidth + totalRounds * (boxWidth + connectorWidth);

  // Height: Based on the number of teams (Team Column is the tallest)
  // Number of pairs = size / 2.
  // Height = Pairs * (2*Box + PairGap) + (Pairs-1)*MatchGap + 2*Padding
  const pairsCount = size / 2;
  const contentHeight = pairsCount * (2 * boxHeight + pairGap) + (pairsCount - 1) * matchGap;
  const height = Math.max(600, contentHeight + 2 * padding);

  const getDisplayName = (name) => {
      if (!name) return 'TBD';
      return name.length > 15 ? name.substring(0, 12) + '...' : name;
  };

  const [hoveredNode, setHoveredNode] = useState(null);

  const getGameStatus = (participantName, nextRoundIdx, nextMatchIdx) => {
      if (!participantName || participantName.startsWith('Match ') || participantName === 'FINAL' || participantName === 'TBD') return null;

      const nextMatch = matches[nextRoundIdx] && matches[nextRoundIdx][nextMatchIdx];
      if (!nextMatch || !nextMatch.winner) return null;

      return nextMatch.winner === participantName ? 'W' : 'L';
  };

  const generateNodes = () => {
    const nodes = [];
    const teamCoords = [];
    let matchCounter = 1;

    // --- 1. Position Teams (Round -1) ---
    // All teams on the left side
    safeTeams.forEach((team, i) => {
        const pairIndex = Math.floor(i / 2);
        const inPairIndex = i % 2;

        // Calculate Y
        // Base Y for the pair
        const pairBaseY = padding + pairIndex * (2 * boxHeight + pairGap + matchGap);
        // Individual Y
        const y = pairBaseY + inPairIndex * (boxHeight + pairGap) + boxHeight / 2;

        teamCoords.push({
            x: padding,
            y,
            r: -1,
            i,
            name: team
        });
    });

    const roundNodes = {}; // map round index -> array of nodes
    roundNodes[-1] = teamCoords;

    // --- 2. Position Matches (Rounds 0 to totalRounds-1) ---
    for (let r = 0; r < totalRounds; r++) {
        const roundMatches = [];
        const prevNodes = roundNodes[r - 1];
        const matchCount = size / Math.pow(2, r + 1);

        for (let i = 0; i < matchCount; i++) {
            const parent1 = prevNodes[2 * i];
            const parent2 = prevNodes[2 * i + 1];

            // Y is average of parents
            const y = (parent1.y + parent2.y) / 2;

            // X is previous X + box + connector
            // But to be consistent, we can just calculate from column index
            // column 0 (Teams) is at padding.
            // column 1 (Round 0) is at padding + boxWidth + connectorWidth
            const x = padding + (r + 1) * (boxWidth + connectorWidth);

            const matchData = (matches && matches[r] && matches[r][i]) ? matches[r][i] : null;
            const isFinal = (r === totalRounds - 1);
            const name = matchData && matchData.winner ? matchData.winner : (isFinal ? "Final" : `M${matchCounter++}`);

            const node = {
                id: `R${r}-M${i}`,
                round: r,
                idx: i,
                x,
                y,
                matchData,
                name,
                isFinal
            };
            roundMatches.push(node);
            nodes.push(node);
        }
        roundNodes[r] = roundMatches;
    }

    return { nodes, teamCoords };
  };

  const { nodes: bracketNodes, teamCoords } = generateNodes();

  const handleNodeClick = (node, type) => {
      if (!onWin) return;
      let winnerName = null;
      let targetRoundIdx = -1;
      let targetMatchIdx = -1;

      if (type === 'team') {
          if (node.name === 'TBD') return;
          winnerName = node.name;
          targetRoundIdx = 0;
          targetMatchIdx = Math.floor(node.i / 2);
      } else {
         if (!node.matchData || !node.matchData.winner) return;
         winnerName = node.matchData.winner;

         if (node.isFinal) return; // Cannot advance from final

         targetRoundIdx = node.round + 1;
         targetMatchIdx = Math.floor(node.idx / 2);
      }

      onWin(targetRoundIdx, targetMatchIdx, winnerName);
  };

  const drawConnectors = () => {
      const paths = [];

      // 1. Connect Teams to Round 0
      teamCoords.forEach(t => {
          const matchIdx = Math.floor(t.i / 2);
          const matchNode = bracketNodes.find(n => n.round === 0 && n.idx === matchIdx);

          if (matchNode) {
              const startX = t.x + boxWidth;
              const startY = t.y;
              const endX = matchNode.x;
              const endY = matchNode.y;

              const midX = (startX + endX) / 2;

              paths.push(
                  <path key={`team-${t.i}-conn`}
                    d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                    fill="none" stroke="var(--border-color)" strokeWidth="2"
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
              );
          }
      });

      // 2. Connect Rounds
      bracketNodes.forEach(node => {
          if (node.isFinal) return;

          const nextRound = node.round + 1;
          const nextIdx = Math.floor(node.idx / 2);
          const nextNode = bracketNodes.find(n => n.round === nextRound && n.idx === nextIdx);

          if (nextNode) {
              const startX = node.x + boxWidth;
              const startY = node.y;
              const endX = nextNode.x;
              const endY = nextNode.y;

              const midX = (startX + endX) / 2;

              paths.push(
                  <path key={`match-${node.id}-conn`}
                    d={`M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`}
                    fill="none" stroke="var(--border-color)" strokeWidth="2"
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
              );
          }
      });

      return paths;
  };

  return (
    <div className="tournament-bracket-container" style={{
        padding: '20px',
        overflow: 'auto',
        textAlign: 'center'
    }}>
      <svg width={width} height={height} style={{ margin: '0 auto', display: 'block' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {drawConnectors().map(element => React.cloneElement(element, { stroke: "var(--border-color)", strokeWidth: "2" }))}

        {teamCoords.map((coord, i) => {
           const isHovered = hoveredNode === `team-${coord.i}`;
           const status = getGameStatus(coord.name, 0, Math.floor(coord.i/2));
           const displayName = getDisplayName(coord.name);
           return (
             <g key={`team-${coord.i}`}
                onMouseEnter={() => setHoveredNode(`team-${coord.i}`)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(coord, 'team')}
                style={{ cursor: 'pointer' }}
             >
                <rect
                    x={coord.x} y={coord.y - boxHeight/2}
                    width={boxWidth} height={boxHeight}
                    fill="rgba(255, 255, 255, 0.05)"
                    stroke={isHovered ? 'var(--accent-primary)' : 'var(--border-color)'}
                    strokeWidth={isHovered ? "2" : "1"}
                    rx="6"
                />
                <text
                    x={coord.x + boxWidth/2} y={coord.y}
                    dy=".35em"
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontWeight={isHovered ? "700" : "500"}
                    fontSize="14"
                    fontFamily="inherit"
                >
                    {displayName}
                </text>
                {status && (
                    <text
                        x={coord.x + boxWidth - 15}
                        y={coord.y}
                        dy=".35em"
                        textAnchor="middle"
                        fill={status === 'W' ? 'var(--success-color)' : 'var(--danger-color)'}
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="Arial"
                    >
                           {status}
                    </text>
                )}
             </g>
           );
        })}

        {bracketNodes.map(node => {
            const isHovered = hoveredNode === node.id;
            const hasWinner = node.matchData && node.matchData.winner;
            let displayName = getDisplayName(node.name);

            const status = !node.isFinal ? getGameStatus(node.name, node.round + 1, Math.floor(node.idx / 2)) : null;

            return (
            <g key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => handleNodeClick(node, 'match')}
                style={{ cursor: (hasWinner || node.isFinal) ? 'pointer' : 'default' }}
            >
                <rect
                    x={node.x} y={node.y - boxHeight/2}
                    width={boxWidth} height={boxHeight}
                    fill={node.isFinal ? "rgba(255, 215, 0, 0.1)" : "rgba(255, 255, 255, 0.05)"}
                    stroke={isHovered || node.isFinal ? 'var(--accent-primary)' : 'var(--border-color)'}
                    strokeWidth={isHovered || node.isFinal ? "2" : "1"}
                    rx="6"
                />
                <text
                    x={node.x + boxWidth/2} y={node.y}
                    dy=".35em"
                    textAnchor="middle"
                    fill="var(--text-primary)"
                    fontWeight={isHovered ? "700" : "500"}
                    fontSize="14"
                    fontFamily="inherit"
                >
                    {displayName}
                </text>
                {status && (
                    <text
                        x={node.x + boxWidth - 15}
                        y={node.y}
                        dy=".35em"
                        textAnchor="middle"
                        fill={status === 'W' ? 'var(--success-color)' : 'var(--danger-color)'}
                        fontSize="14"
                        fontWeight="bold"
                        fontFamily="Arial"
                    >
                           {status}
                    </text>
                )}
            </g>
            );
        })}
      </svg>
    </div>
  );
};

export default TournamentBracket;

