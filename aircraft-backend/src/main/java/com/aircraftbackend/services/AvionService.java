package com.aircraftbackend.services;

import com.aircraftbackend.Repositories.AvionRepository;
import com.aircraftbackend.entities.Avion;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AvionService {
    private final AvionRepository avionRepository;

    public AvionService(AvionRepository avionRepository) {
        this.avionRepository = avionRepository;
    }

    public List<Avion> getAll() {
        return avionRepository.findAll();
    }

    public Optional<Avion> getById(Long id) {
        return avionRepository.findById(id);
    }

    public Optional<Avion> getByModele(String modele) {
        return avionRepository.findByModele(modele);
    }

    public Avion create(Avion avion) {
        return avionRepository.save(avion);
    }

    public void delete(Long id) {
        avionRepository.deleteById(id);
    }

    public Avion update(Long id, Avion avion) {
        Optional<Avion> optional = avionRepository.findById(id);
        if(optional.isPresent()) {
            Avion updated = optional.get();
            updated.setComposants(avion.getComposants());
            updated.setImmatriculation(avion.getImmatriculation());
            updated.setStatut(avion.getStatut());
            updated.setModele(avion.getModele());
            updated.setDateDerniereMaintenance(avion.getDateDerniereMaintenance());
            return avionRepository.save(updated);
        }
        throw new RuntimeException("Avion not found with id: " + id);
    }
}
