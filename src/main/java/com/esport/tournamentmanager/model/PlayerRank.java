package com.esport.tournamentmanager.model;

public enum PlayerRank {
    IRON_IV(825), IRON_III(875), IRON_II(925), IRON_I(975),
    BRONZE_IV(1025), BRONZE_III(1075), BRONZE_II(1125), BRONZE_I(1175),
    SILVER_IV(1225), SILVER_III(1275), SILVER_II(1325), SILVER_I(1375),
    GOLD_IV(1425), GOLD_III(1475), GOLD_II(1525), GOLD_I(1575),
    PLATINUM_IV(1625), PLATINUM_III(1675), PLATINUM_II(1725), PLATINUM_I(1775),
    EMERALD_IV(1825), EMERALD_III(1875), EMERALD_II(1925), EMERALD_I(1975),
    DIAMOND_IV(2025), DIAMOND_III(2075), DIAMOND_II(2125), DIAMOND_I(2175),

    MASTER(2300),
    GRANDMASTER(2450),
    CHALLENGER(2650);

    private final int mmrValue;
    PlayerRank(int mmrValue) { this.mmrValue = mmrValue; }
    public int getMmrValue() { return mmrValue; }
}
