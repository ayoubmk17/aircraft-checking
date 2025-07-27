package com.aircraftbackend.services;

import com.aircraftbackend.Repositories.UtilisateurRepository;
import com.aircraftbackend.entities.Utilisateur;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public List<Utilisateur> getAll() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> getById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur create(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public void delete(Long id) {
        utilisateurRepository.deleteById(id);
    }

    public Utilisateur update(Long id, Utilisateur utilisateur) {
        Optional<Utilisateur> optional = utilisateurRepository.findById(id);
        if (optional.isPresent()) {
            Utilisateur updated=optional.get();
            updated.setPrenom(utilisateur.getPrenom());
            updated.setNom(utilisateur.getNom());
            updated.setEmail(utilisateur.getEmail());
            updated.setRole(utilisateur.getRole());
            utilisateurRepository.save(updated);
        }
        return optional.get();
    }

    public Utilisateur findByEmail(String email) {
        return utilisateurRepository.findByEmail(email).orElse(null);
    }

}
