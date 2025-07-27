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
            Composant updated = optional.get();
            System.out.println("=== DEBUG COMPOSANT UPDATE ===");
            System.out.println("ID: " + id);
            System.out.println("Ancien état: " + updated.getEtat());
            System.out.println("Nouvel état: " + composant.getEtat());
            System.out.println("Nouveau nom: " + composant.getNom());
            System.out.println("Nouvelle description: " + composant.getDescription());
            System.out.println("Nouvel avion: " + (composant.getAvion() != null ? composant.getAvion().getId() : "null"));
            
            // Forcer la mise à jour
            updated.setNom(composant.getNom());
            updated.setDescription(composant.getDescription());
            updated.setAvion(composant.getAvion());
            updated.setEtat(composant.getEtat());
            
            // Sauvegarder
            Composant saved = composantRepository.save(updated);
            System.out.println("État après sauvegarde: " + saved.getEtat());
            
            // Forcer le commit et vérifier en base
            composantRepository.flush(); // Force la synchronisation avec la base
            System.out.println("Flush effectué");
            
            // Vérifier en relisant depuis la base
            Optional<Composant> verification = composantRepository.findById(id);
            if (verification.isPresent()) {
                System.out.println("État après vérification en base: " + verification.get().getEtat());
                System.out.println("ID vérifié: " + verification.get().getId());
                System.out.println("Nom vérifié: " + verification.get().getNom());
            } else {
                System.out.println("ERREUR: Composant non trouvé après mise à jour!");
            }
            
            System.out.println("=== FIN DEBUG ===");
            return saved;
        }
        System.out.println("Composant non trouvé avec ID: " + id);
        return null;
    }

    public void delete(Long id) {composantRepository.deleteById(id);}

}
