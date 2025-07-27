package com.aircraftbackend.controllers;

import com.aircraftbackend.entities.Utilisateur;
import com.aircraftbackend.services.UtilisateurService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("api/users")
@CrossOrigin(origins = "*")
public class UtilisateurController {
    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping
    public List<Utilisateur> getAll() {
        System.out.println("GET /api/users - Récupération de tous les utilisateurs");
        try {
            List<Utilisateur> users = utilisateurService.getAll();
            System.out.println("Utilisateurs trouvés: " + users.size());
            return users;
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération des utilisateurs: " + e.getMessage());
            throw e;
        }
    }

    @GetMapping("/{id}")
    public Utilisateur getById(@PathVariable Long id) {
        System.out.println("GET /api/users/" + id + " - Récupération utilisateur par ID");
        return utilisateurService.getById(id).orElse(null);
    }

    @PostMapping
    public Utilisateur create(@RequestBody Utilisateur utilisateur) {
        System.out.println("POST /api/users - Création d'un nouvel utilisateur: " + utilisateur);
        try {
            Utilisateur created = utilisateurService.create(utilisateur);
            System.out.println("Utilisateur créé avec succès: " + created);
            return created;
        } catch (Exception e) {
            System.err.println("Erreur lors de la création de l'utilisateur: " + e.getMessage());
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        System.out.println("DELETE /api/users/" + id + " - Suppression d'un utilisateur");
        try {
            utilisateurService.delete(id);
            System.out.println("Utilisateur supprimé avec succès");
        } catch (Exception e) {
            System.err.println("Erreur lors de la suppression de l'utilisateur: " + e.getMessage());
            throw e;
        }
    }

    @PutMapping("/{id}")
    public void update(@PathVariable Long id, @RequestBody Utilisateur utilisateur) {
        System.out.println("PUT /api/users/" + id + " - Mise à jour d'un utilisateur: " + utilisateur);
        try {
            utilisateurService.update(id, utilisateur);
            System.out.println("Utilisateur mis à jour avec succès");
        } catch (Exception e) {
            System.err.println("Erreur lors de la mise à jour de l'utilisateur: " + e.getMessage());
            throw e;
        }
    }
}
