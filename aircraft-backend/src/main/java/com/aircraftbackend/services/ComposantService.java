package com.aircraftbackend.services;

import com.aircraftbackend.Repositories.AvionRepository;
import com.aircraftbackend.Repositories.ComposantRepository;
import com.aircraftbackend.entities.Avion;
import com.aircraftbackend.entities.Composant;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComposantService {
    private final ComposantRepository composantRepository;
    private final AvionRepository avionRepository;

    public ComposantService(ComposantRepository composantRepository, AvionRepository avionRepository) {
        this.composantRepository = composantRepository;
        this.avionRepository = avionRepository;
    }

    public List<Composant> getAll() {
        return composantRepository.findAll();
    }

    public Optional<Composant> getById(Long id) {
        return composantRepository.findById(id);
    }

    public Optional<Composant> getBynom(String nom) {
        return composantRepository.findByNom(nom);
    }

    public List<Composant> getByAvion(Long avionId) {
        return composantRepository.findAllByAvion_Id(avionId);
    }

    public Composant create(Composant composant) {
        return composantRepository.save(composant);
    }

    public Composant update(Long id, Composant composant) {
        Optional<Composant> optional = composantRepository.findById(id);
        if (optional.isPresent()) {
            Composant updated = optional.get();

            if (composant.getNom() != null) updated.setNom(composant.getNom());
            if (composant.getDescription() != null) updated.setDescription(composant.getDescription());
            if (composant.getAvion() != null) updated.setAvion(composant.getAvion());
            if (composant.getEtat() != null) updated.setEtat(composant.getEtat());

            Composant saved = composantRepository.save(updated);

            // Vérification de l'état de tous les composants de l’avion
            if (saved.getAvion() != null) {
                Long avionId = saved.getAvion().getId();
                List<Composant> composantsAvion = composantRepository.findAllByAvion_Id(avionId);

                boolean tousRepares = composantsAvion.stream()
                        .allMatch(c -> c.getEtat() == Composant.Etat.OK || c.getEtat() == Composant.Etat.REPARE);

                if (tousRepares) {
                    Avion avion = saved.getAvion();
                    avion.setStatut(Avion.Statut.ACTIF);
                    avionRepository.save(avion);
                    System.out.println("✅ Avion ID " + avionId + " remis en service (ACTIF).");
                }
            }

            return saved;
        }

        System.out.println("❌ Composant non trouvé avec ID: " + id);
        return null;
    }

    public void delete(Long id) {
        composantRepository.deleteById(id);
    }
}
