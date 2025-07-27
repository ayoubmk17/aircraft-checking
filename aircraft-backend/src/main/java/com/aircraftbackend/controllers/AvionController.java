package com.aircraftbackend.controllers;


import com.aircraftbackend.entities.Avion;
import com.aircraftbackend.services.AvionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/avions")
@CrossOrigin(origins = "*")
public class AvionController {
    private final AvionService avionService;

    public AvionController(AvionService avionService) {
        this.avionService = avionService;
    }

    @GetMapping
    public List<Avion> getAll() {
        return avionService.getAll();
    }

    @GetMapping("/{id}")
    public Avion getById(@PathVariable Long id) {
        return avionService.getById(id).orElse(null);
    }

    @GetMapping("/modele/{modele}")
    public Optional<Avion> getByModele(@PathVariable String modele) {
        return avionService.getByModele(modele);
    }

    @PostMapping
    public Avion create(@RequestBody Avion avion) {
        return avionService.create(avion);
    }

    @PutMapping("/{id}")
    public Avion update(@PathVariable Long id, @RequestBody Avion avion) {
        return avionService.update(id, avion);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        avionService.delete(id);
    }
}
