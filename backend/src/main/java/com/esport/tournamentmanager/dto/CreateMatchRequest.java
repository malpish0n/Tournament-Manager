package com.esport.tournamentmanager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateMatchRequest {
    @NotBlank(message = "Format is required")
    private String format;

    @NotBlank(message = "Series type is required")
    private String seriesType;

    @NotNull(message = "Team A is required")
    private List<String> teamA;

    @NotNull(message = "Team B is required")
    private List<String> teamB;

    private String teamAName;
    private String teamBName;
}
