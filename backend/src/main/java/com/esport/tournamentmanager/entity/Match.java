package com.esport.tournamentmanager.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Match {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String format;

    @Column(nullable = false)
    private String seriesType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String teamA;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String teamB;

    private String teamAName;
    private String teamBName;

    @Column(nullable = false)
    private Integer scoreA = 0;

    @Column(nullable = false)
    private Integer scoreB = 0;

    private String winner;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
