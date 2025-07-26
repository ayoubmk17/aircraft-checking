package com.aircraftbackend.controllers;


import com.aircraftbackend.entities.Rapport;
import com.aircraftbackend.services.RapportService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
@CrossOrigin(origins="*")
@PreAuthorize("hasAnyRole('ADMIN', 'INGENIEUR','MECANICIEN')")
public class RapportController {
    private final RapportService rapportService;

    public RapportController(RapportService rapportService) {
        this.rapportService = rapportService;
    }

    @GetMapping
    public List<Rapport> getAll() {
        return rapportService.getAll();
    }

    @GetMapping("/{id}")
    public Rapport getById(@PathVariable Long id) {
        return rapportService.getById(id).orElse(null);
    }

    @PostMapping
    public Rapport create(@RequestBody Rapport rapport) {
        return rapportService.create(rapport);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        rapportService.delete(id);
    }
}
