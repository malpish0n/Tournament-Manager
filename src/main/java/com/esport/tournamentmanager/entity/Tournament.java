package com.esport.tournamentmanager.entity;

import com.esport.tournamentmanager.model.TournamentType;
import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tournaments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Tournament {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private TournamentType type = TournamentType.SINGLE_ELIM;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<Match> matches = new ArrayList<>();
}
