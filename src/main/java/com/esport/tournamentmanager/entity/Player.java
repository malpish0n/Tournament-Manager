package com.esport.tournamentmanager.entity;

import com.esport.tournamentmanager.model.PlayerRank;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "players")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nick;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlayerRank rank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    // Computed MMR
    @Transient
    public int getMmr() {
        return rank.getMmrValue();
    }
}
