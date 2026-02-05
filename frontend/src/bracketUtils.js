export const generateBracket = (participants) => {
    const size = participants.length;
    let matchIdCounter = 1;

    // Calculate proper seeding order
    // e.g. for 8 teams (4 matches): [1, 4, 2, 3] -> Matches 1v8, 4v5, 2v7, 3v6
    const getMatchOrder = (numMatches) => {
        let seeds = [1];
        let count = 1;
        while (count < numMatches) {
            const next = [];
            for (let s of seeds) {
                next.push(s);
                next.push(count * 2 + 1 - s);
            }
            seeds = next;
            count *= 2;
        }
        return seeds;
    };

    const numMatchesR1 = size / 2;
    const matchSeeds = getMatchOrder(numMatchesR1);

    // ROUND 1
    const round1 = matchSeeds.map(seed => {
        const p1Idx = seed - 1;
        const p2Idx = size - seed;

        const p1Name = participants[p1Idx] ? `#${seed} ${participants[p1Idx]}` : 'TBD';
        const p2Name = participants[p2Idx] ? `#${size - seed + 1} ${participants[p2Idx]}` : 'TBD';

        return {
            id: matchIdCounter++,
            round: 1,
            player1: p1Name,
            player2: p2Name,
            winner: null
        };
    });

    const rounds = [round1];
    let currentRound = round1;

    // Generate subsequent rounds
    while (currentRound.length > 1) {
        const nextRound = [];
        for (let i = 0; i < currentRound.length; i += 2) {
            nextRound.push({
                id: matchIdCounter++,
                round: rounds.length + 1,
                player1: null, // To be filled by winner of currentRound[i]
                player2: null, // To be filled by winner of currentRound[i+1]
                winner: null,
                sourceMatch1: currentRound[i].id,
                sourceMatch2: currentRound[i + 1].id
            });
        }
        rounds.push(nextRound);
        currentRound = nextRound;
    }

    return rounds;
};

export const updateBracket = (bracket, roundIndex, matchIndex, winnerName) => {
    // Deep copy
    const newBracket = JSON.parse(JSON.stringify(bracket));
    const match = newBracket[roundIndex][matchIndex];

    // Set winner
    match.winner = winnerName;

    // Propagate to next round
    const nextRoundIndex = roundIndex + 1;
    if (nextRoundIndex < newBracket.length) {
        // Find match in next round that depends on this match
        const nextRound = newBracket[nextRoundIndex];
        const nextMatch = nextRound.find(m =>
            m.sourceMatch1 === match.id || m.sourceMatch2 === match.id
        );

        if (nextMatch) {
            if (nextMatch.sourceMatch1 === match.id) {
                nextMatch.player1 = winnerName;
            } else {
                nextMatch.player2 = winnerName;
            }
            // Reset next match winner if it was already set (in case of correction)
            nextMatch.winner = null;
        }
    }

    return newBracket;
};

