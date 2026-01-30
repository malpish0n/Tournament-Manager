export const generateBracket = (participants) => {
    const size = participants.length;
    const rounds = [];
    let matchIdCounter = 1;

    // Helper to calculate rounds count (log2 of size)
    const totalRounds = Math.log2(size);

    // ROUND 1
    const round1 = [];
    const numMatchesR1 = size / 2;

    // Simple seeding logic: 1 vs Size, 2 vs Size-1, etc.
    // Or just adjacent pairs: 1 vs 2, 3 vs 4.
    // Let's do adjacent for simplicity of visual flow (Top to Bottom)
    // 1 vs 2 -> Winner to Next Match Top
    // 3 vs 4 -> Winner to Next Match Bottom
    for (let i = 0; i < numMatchesR1; i++) {
        round1.push({
            id: matchIdCounter++,
            round: 1,
            player1: participants[i * 2] || 'BYE',
            player2: participants[i * 2 + 1] || 'BYE',
            score1: '',
            score2: '',
            winner: null,
            nextMatchId: null // To be filled
        });
    }
    rounds.push(round1);

    // SUBSEQUENT ROUNDS
    let currentRoundMatches = round1;
    for (let r = 2; r <= totalRounds; r++) {
        const nextRoundMatches = [];
        const numMatches = currentRoundMatches.length / 2;

        for (let i = 0; i < numMatches; i++) {
            const match = {
                id: matchIdCounter++,
                round: r,
                player1: null, // To be decided from previous round
                player2: null,
                score1: '',
                score2: '',
                winner: null
            };

            // Link previous matches to this one
            currentRoundMatches[i * 2].nextMatchId = match.id;
            currentRoundMatches[i * 2 + 1].nextMatchId = match.id;

            nextRoundMatches.push(match);
        }
        rounds.push(nextRoundMatches);
        currentRoundMatches = nextRoundMatches;
    }

    return rounds;
};

