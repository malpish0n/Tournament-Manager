package com.esport.tournamentmanager.repository;

import com.esport.tournamentmanager.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamIdOrderByRankDesc(Long teamId);
    List<Player> findByTeamId(Long teamId);
}
