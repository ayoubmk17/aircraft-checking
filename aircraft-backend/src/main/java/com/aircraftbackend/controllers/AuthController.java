package com.aircraftbackend.controllers;

import com.aircraftbackend.entities.Utilisateur;
import com.aircraftbackend.services.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UtilisateurService utilisateurService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        try {
            // Rechercher l'utilisateur par email
            Utilisateur utilisateur = utilisateurService.findByEmail(email);
            
            if (utilisateur != null && utilisateur.getPassword().equals(password)) {
                // Authentification réussie
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Connexion réussie");
                response.put("user", Map.of(
                    "id", utilisateur.getId(),
                    "nom", utilisateur.getNom(),
                    "prenom", utilisateur.getPrenom(),
                    "email", utilisateur.getEmail(),
                    "role", utilisateur.getRole()
                ));
                return ResponseEntity.ok(response);
            } else {
                // Identifiants incorrects
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Email ou mot de passe incorrect");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Erreur lors de l'authentification");
            return ResponseEntity.internalServerError().body(response);
        }
    }
} 