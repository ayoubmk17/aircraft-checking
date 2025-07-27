package com.aircraftbackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConfig {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Bean
    public CommandLineRunner fixAvionConstraint() {
        return args -> {
            try {
                // Supprimer l'ancienne contrainte si elle existe
                jdbcTemplate.execute("ALTER TABLE avion DROP CONSTRAINT IF EXISTS avion_statut_check");
                
                // Ajouter la nouvelle contrainte avec les bons statuts
                jdbcTemplate.execute("ALTER TABLE avion ADD CONSTRAINT avion_statut_check CHECK (statut IN ('ACTIF', 'MAINTENANCE', 'RETIRE'))");
                
                System.out.println("✅ Contrainte avion_statut_check mise à jour avec succès");
            } catch (Exception e) {
                System.out.println("⚠️ Erreur lors de la mise à jour de la contrainte: " + e.getMessage());
                // Ne pas faire échouer l'application si la contrainte ne peut pas être mise à jour
            }
        };
    }
} 