package com.esport.tournamentmanager.model;

public enum MatchFormat {
    BO1(1), BO3(2), BO5(3);

    private final int targetWins;
    MatchFormat(int targetWins) { this.targetWins = targetWins; }
    public int getTargetWins() { return targetWins; }
    public boolean isFinished(int scoreA, int scoreB) {
        return Math.max(scoreA, scoreB) >= targetWins;
    }
}
