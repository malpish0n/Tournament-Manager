package com.esport.tournamentmanager.service;

import com.esport.tournamentmanager.dto.CreatePlayerRequest;
import com.esport.tournamentmanager.dto.PlayerDTO;
import com.esport.tournamentmanager.entity.Player;
import com.esport.tournamentmanager.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class PlayerService {

    private final PlayerRepository playerRepository;

    public List<PlayerDTO> getAllPlayers() {
        return playerRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PlayerDTO createPlayer(CreatePlayerRequest request) {
        Player player = Player.builder()
                .nick(request.getNick())
                .build();

        Player saved = playerRepository.save(player);
        return toDTO(saved);
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    private PlayerDTO toDTO(Player player) {
        return PlayerDTO.builder()
                .id(player.getId())
                .nick(player.getNick())
                .build();
    }
}

