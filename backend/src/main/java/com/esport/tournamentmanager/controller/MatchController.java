package com.esport.tournamentmanager.controller;

import com.esport.tournamentmanager.dto.CreateMatchRequest;
import com.esport.tournamentmanager.dto.MatchDTO;
import com.esport.tournamentmanager.dto.UpdateScoreRequest;
import com.esport.tournamentmanager.service.MatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MatchController {

    private final MatchService matchService;

    @GetMapping
    public ResponseEntity<List<MatchDTO>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @PostMapping
    public ResponseEntity<MatchDTO> createMatch(@Valid @RequestBody CreateMatchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(matchService.createMatch(request));
    }

    @PatchMapping("/{id}/score")
    public ResponseEntity<MatchDTO> updateScore(
            @PathVariable Long id,
            @Valid @RequestBody UpdateScoreRequest request) {
        return ResponseEntity.ok(matchService.updateScore(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        matchService.deleteMatch(id);
        return ResponseEntity.noContent().build();
    }
}

