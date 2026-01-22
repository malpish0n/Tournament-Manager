package com.esport.tournamentmanager.repository;

import com.esport.tournamentmanager.entity.Match;
import com.esport.tournamentmanager.entity.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByTournament(Tournament tournament);

    List<Match> findByWinnerIsNull();
}
