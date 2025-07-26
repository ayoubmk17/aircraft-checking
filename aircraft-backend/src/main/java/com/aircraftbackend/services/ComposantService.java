package com.aircraftbackend.services;

import com.aircraftbackend.Repositories.ComposantRepository;
import com.aircraftbackend.entities.Composant;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ComposantService {
    private final ComposantRepository composantRepository;

    public ComposantService(ComposantRepository composantRepository) {this.composantRepository = composantRepository;}

    public List<Composant> getAll(){return composantRepository.findAll();}

    public Optional<Composant> getById(Long id){return composantRepository.findById(id);}

    public Optional<Composant> getBynom(String nom){return composantRepository.findByNom(nom);}

    public List<Composant> getByAvion(Long avionId){ return composantRepository.findAllByAvion_Id(avionId);}

    public Composant create(Composant composant){return composantRepository.save(composant);}

    public Composant update(Long id, Composant composant) {
        Optional<Composant> optional = composantRepository.findById(id);
        if (optional.isPresent()) {
            Composant updated=optional.get();
            updated.setNom(composant.getNom());
            updated.setDescription(composant.getDescription());
            updated.setAvion(composant.getAvion());
            updated.setEtat(composant.getEtat());
            composantRepository.save(updated);
        }
        return optional.get();
    }

    public void delete(Long id) {composantRepository.deleteById(id);}

}
