package com.esport.tournamentmanager.entity;

import com.esport.tournamentmanager.model.MatchFormat;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "matches")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Match {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "team_a_id")
    private Team teamA;

    @ManyToOne @JoinColumn(name = "team_b_id")
    private Team teamB;

    private Integer scoreA = 0;
    private Integer scoreB = 0;

    @ManyToOne @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @ManyToOne
    private Team winner;

    @Enumerated(EnumType.STRING)
    private MatchFormat format = MatchFormat.BO1;
}
