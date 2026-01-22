package com.esport.tournamentmanager.repository;

import com.esport.tournamentmanager.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {}
