import React, { useState, useEffect } from 'react';

const TournamentBracket = ({ teams = [], matches = [], onWin }) => {
  const incomingSize = teams.length;
  const size = [4, 8, 16].includes(incomingSize) ? incomingSize : 8;

  const safeTeams = [...teams, ...Array(size).fill('TBD')].slice(0, size);

  const boxWidth = 160;
  const boxHeight = 40;
  const pairGap = 20;
  const matchGap = 40;

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const padding = 50;
  const totalRounds = Math.log2(size);

  const minStep = boxWidth + 40;
  const minRequiredWidth = 2 * (totalRounds * minStep + padding) + boxWidth;
  const width = Math.max(windowWidth - 80, minRequiredWidth);

  const xStep = (width / 2 - boxWidth / 2 - padding) / totalRounds;

  const height = Math.max(600, (size / 2) * 80 + 100);

  const getDisplayName = (name) => {
      if (!name) return 'TBD';
      return name.length > 15 ? name.substring(0, 12) + '...' : name;
  };

  const getRoundX = (roundIndex, side) => {
      const centerX = width / 2;
      const roundSpacing = 250;

      if (side === 'center') return centerX - boxWidth / 2;

      const distFromCenter = (totalRounds - 1 - roundIndex) * roundSpacing;

      if (side === 'left') {
          return centerX - distFromCenter - roundSpacing - boxWidth;
      } else {
          return centerX + distFromCenter + roundSpacing;
      }

      if (side === 'left') {
          return padding + roundIndex * roundSpacing;
      } else {
          return width - padding - boxWidth - roundIndex * roundSpacing;
      }
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

    const halfSize = size / 2;
    const leftTeams = safeTeams.slice(0, halfSize);
    const rightTeams = safeTeams.slice(halfSize, size);

    leftTeams.forEach((team, i) => {
        const matchIndex = Math.floor(i / 2);
        const inMatchIndex = i % 2;
        const blockStartY = padding + matchIndex * (boxHeight * 2 + pairGap + matchGap);
        const y = blockStartY + inMatchIndex * (boxHeight + pairGap) + boxHeight/2;
        teamCoords.push({ x: padding, y, r: -1, i, side: 'left', name: team });
    });

    rightTeams.forEach((team, i) => {
        const matchIndex = Math.floor(i / 2);
        const inMatchIndex = i % 2;
        const blockStartY = padding + matchIndex * (boxHeight * 2 + pairGap + matchGap);
        const y = blockStartY + inMatchIndex * (boxHeight + pairGap) + boxHeight/2;
        teamCoords.push({ x: width - padding - boxWidth, y, r: -1, i: halfSize + i, side: 'right', name: team });
    });

    const roundYPositions = {};
    roundYPositions[-1] = {
        left: teamCoords.filter(t => t.side === 'left').map(t => t.y),
        right: teamCoords.filter(t => t.side === 'right').map(t => t.y)
    };

    let currentRoundCount = size / 2;

    for (let r = 0; r < totalRounds; r++) {
        roundYPositions[r] = { left: [], right: [] };

        const isFinalRound = (r === totalRounds - 1);

        if (isFinalRound) {
            const inputY1 = roundYPositions[r-1].left[0];
            const inputY2 = roundYPositions[r-1].right[0];
            const y = (inputY1 + inputY2) / 2;

            const x = width / 2 - boxWidth / 2;

            const matchData = (matches && matches[r] && matches[r][0]) ? matches[r][0] : null;
            const name = matchData && matchData.winner ? matchData.winner : "Final";

            nodes.push({
                id: `Final`, round: r, idx: 0, x, y,
                matchData, name, side: 'center', isFinal: true
            });
            continue;
        }

        const matchesInSide = currentRoundCount / 2;

        for (let i = 0; i < matchesInSide; i++) {
             const inputY1 = roundYPositions[r-1].left[i*2];
             const inputY2 = roundYPositions[r-1].left[i*2+1];
             const y = (inputY1 + inputY2) / 2;
             roundYPositions[r].left.push(y);

             const x = padding + (r + 1) * xStep;

             const matchData = (matches && matches[r] && matches[r][i]) ? matches[r][i] : null;
             const name = matchData && matchData.winner ? matchData.winner : `M${matchCounter++}`;

             nodes.push({
                 id: `R${r}-L${i}`, round: r, idx: i, x, y,
                 matchData, name, side: 'left'
             });
        }

        for (let i = 0; i < matchesInSide; i++) {
             const inputY1 = roundYPositions[r-1].right[i*2];
             const inputY2 = roundYPositions[r-1].right[i*2+1];
             const y = (inputY1 + inputY2) / 2;
             roundYPositions[r].right.push(y);

             const x = width - padding - boxWidth - (r + 1) * xStep;

             const globalIdx = matchesInSide + i;
             const matchData = (matches && matches[r] && matches[r][globalIdx]) ? matches[r][globalIdx] : null;
             const name = matchData && matchData.winner ? matchData.winner : `M${matchCounter++}`;

             nodes.push({
                 id: `R${r}-R${i}`, round: r, idx: globalIdx, x, y,
                 matchData, name, side: 'right'
             });
        }

        currentRoundCount /= 2;
    }

    return { nodes, teamCoords };
  };

  const { nodes: bracketNodes, teamCoords } = generateNodes();

  const dynamicHeight = height;

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
         targetRoundIdx = node.round + 1;

         if (node.isFinal) return;

         targetMatchIdx = Math.floor(node.idx / 2);
      }
      onWin(targetRoundIdx, targetMatchIdx, winnerName);
  };

  const drawConnectors = () => {
      const paths = [];

      teamCoords.forEach(t => {
          const matchIdx = Math.floor(t.i / 2);
          const matchNode = bracketNodes.find(n => n.round === 0 && n.idx === matchIdx);

          if (matchNode) {
              const starX = (t.side === 'left') ? t.x + boxWidth : t.x;
              const endX = (t.side === 'left') ? matchNode.x : matchNode.x + boxWidth;

              const direction = (t.side === 'left') ? 1 : -1;
              const midX = starX + (direction * 25);

              paths.push(
                  <path key={`team-${t.i}-conn`}
                    d={`M ${starX} ${t.y} H ${midX} V ${matchNode.y} H ${endX}`}
                    fill="none" stroke="var(--border-color)" strokeWidth="2"
                  />
              );
          }
      });

      bracketNodes.forEach(node => {
          if (node.isFinal) return;

          const nextRound = node.round + 1;
          const nextIdx = Math.floor(node.idx / 2);
          const nextNode = bracketNodes.find(n => n.round === nextRound && n.idx === nextIdx);

          if (nextNode) {
              const startX = (node.side === 'left') ? node.x + boxWidth : node.x;
              const endX = (nextNode.side === 'left') ? nextNode.x :
                           (nextNode.side === 'right') ? nextNode.x + boxWidth :
                           (nextNode.side === 'center' && node.side === 'left') ? nextNode.x :
                           (nextNode.side === 'center' && node.side === 'right') ? nextNode.x + boxWidth : nextNode.x;

              const direction = (node.side === 'left') ? 1 : -1;
              const midX = startX + (direction * 25);

              paths.push(
                  <path key={`match-${node.id}-conn`}
                    d={`M ${startX} ${node.y} H ${midX} V ${nextNode.y} H ${endX}`}
                    fill="none" stroke="var(--border-color)" strokeWidth="2"
                  />
              );
          }
      });

      return paths;
  };

  return (
    <div className="tournament-bracket-container" style={{
        backgroundColor: 'var(--bg-dark)',
        padding: '20px',
        overflow: 'auto',
        textAlign: 'center'
    }}>
      <svg width={width} height={dynamicHeight} style={{ margin: '0 auto', display: 'block' }}>
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
                    fill="var(--bg-card)"
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
                        x={coord.x + (coord.side === 'left' ? boxWidth - 15 : 15)}
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
                    fill={node.isFinal ? "rgba(255, 215, 0, 0.1)" : "var(--bg-card)"}
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
                        x={node.x + (node.side === 'left' ? boxWidth - 15 : (node.side === 'right' ? 15 : boxWidth - 15))}
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

