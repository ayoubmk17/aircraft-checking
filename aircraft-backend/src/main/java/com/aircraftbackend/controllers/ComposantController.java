package com.aircraftbackend.controllers;

import com.aircraftbackend.entities.Composant;
import com.aircraftbackend.services.ComposantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/composants")
@CrossOrigin(origins = "*")
public class ComposantController {
    private final ComposantService composantService;

    public ComposantController(ComposantService composantService) {
        this.composantService = composantService;
    }

    @GetMapping
    public List<Composant> getAll() {
        return composantService.getAll();
    }

    @GetMapping("/{id}")
    public Composant getById(@PathVariable Long id) {
        return composantService.getById(id).orElse(null);
    }

    @GetMapping("/avion/{avionId}")
    public List<Composant> getByAvion(@PathVariable Long avionId) {
        return composantService.getByAvion(avionId);
    }

    @GetMapping("/{nom}")
    public Optional<Composant> getByNom(@PathVariable String nom) {
        return composantService.getBynom(nom);
    }

    @PostMapping
    public Composant create(@RequestBody Composant composant) {
        return composantService.create(composant);
    }

    @PutMapping("/{id}")
    public Composant update(@PathVariable Long id, @RequestBody Composant composant) {
        System.out.println("=== DEBUG CONTROLLER COMPOSANT UPDATE ===");
        System.out.println("ID reçu: " + id);
        System.out.println("Payload reçu: " + composant);
        System.out.println("État reçu: " + composant.getEtat());
        System.out.println("Nom reçu: " + composant.getNom());
        System.out.println("Avion reçu: " + (composant.getAvion() != null ? composant.getAvion().getId() : "null"));
        
        Composant result = composantService.update(id, composant);
        
        System.out.println("Résultat retourné: " + result);
        System.out.println("État retourné: " + (result != null ? result.getEtat() : "null"));
        System.out.println("=== FIN DEBUG CONTROLLER ===");
        
        return result;
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        composantService.delete(id);
    }
}
