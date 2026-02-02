package com.esport.tournamentmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchDTO {
    private Long id;
    private String format;
    private String seriesType;
    private List<String> teamA;
    private List<String> teamB;
    private Integer scoreA;
    private Integer scoreB;
    private String winner;
    private String createdAt;
    private String teamAName;
    private String teamBName;
}
