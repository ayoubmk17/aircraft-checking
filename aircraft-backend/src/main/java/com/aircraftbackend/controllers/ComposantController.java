package com.aircraftbackend.controllers;

import com.aircraftbackend.entities.Composant;
import com.aircraftbackend.services.ComposantService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/composants")
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

    @GetMapping("/{avionId}")
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

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        composantService.delete(id);
    }
}
