package com.aircraftbackend.controllers;

import com.aircraftbackend.entities.Utilisateur;
import com.aircraftbackend.services.UtilisateurService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("api/users")
public class UtilisateurController {
    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    public List<Utilisateur> getAll() {
        return utilisateurService.getAll();
    }

    @GetMapping("/{id}")
    public Utilisateur getById(@PathVariable Long id) {
        return utilisateurService.getById(id).orElse(null);
    }

    @PostMapping
    public Utilisateur create(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.create(utilisateur);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        utilisateurService.delete(id);
    }
}
