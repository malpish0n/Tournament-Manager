package com.esport.tournamentmanager.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateScoreRequest {
    @NotNull
    @Min(0)
    private Integer scoreA;

    @NotNull
    @Min(0)
    private Integer scoreB;
}

