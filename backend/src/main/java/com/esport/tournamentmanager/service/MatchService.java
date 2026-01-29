package com.esport.tournamentmanager.service;

import com.esport.tournamentmanager.dto.CreateMatchRequest;
import com.esport.tournamentmanager.dto.MatchDTO;
import com.esport.tournamentmanager.dto.UpdateScoreRequest;
import com.esport.tournamentmanager.entity.Match;
import com.esport.tournamentmanager.repository.MatchRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class MatchService {

    private final MatchRepository matchRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<MatchDTO> getAllMatches() {
        return matchRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MatchDTO createMatch(CreateMatchRequest request) {
        Match match = Match.builder()
                .format(request.getFormat())
                .seriesType(request.getSeriesType())
                .teamA(toJson(request.getTeamA()))
                .teamB(toJson(request.getTeamB()))
                .scoreA(0)
                .scoreB(0)
                .build();

        Match saved = matchRepository.save(match);
        return toDTO(saved);
    }

    public MatchDTO updateScore(Long id, UpdateScoreRequest request) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        match.setScoreA(request.getScoreA());
        match.setScoreB(request.getScoreB());

        if (request.getScoreA() > request.getScoreB()) {
            match.setWinner("Team A");
        } else if (request.getScoreB() > request.getScoreA()) {
            match.setWinner("Team B");
        } else {
            match.setWinner(null);
        }

        Match updated = matchRepository.save(match);
        return toDTO(updated);
    }

    public void deleteMatch(Long id) {
        matchRepository.deleteById(id);
    }

    private MatchDTO toDTO(Match match) {
        return MatchDTO.builder()
                .id(match.getId())
                .format(match.getFormat())
                .seriesType(match.getSeriesType())
                .teamA(fromJson(match.getTeamA()))
                .teamB(fromJson(match.getTeamB()))
                .scoreA(match.getScoreA())
                .scoreB(match.getScoreB())
                .winner(match.getWinner())
                .createdAt(match.getCreatedAt().format(DateTimeFormatter.ofPattern("M/d/yyyy, h:mm:ss a")))
                .build();
    }

    private String toJson(List<String> list) {
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error converting to JSON", e);
        }
    }

    private List<String> fromJson(String json) {
        try {
            return Arrays.asList(objectMapper.readValue(json, String[].class));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error parsing JSON", e);
        }
    }
}

