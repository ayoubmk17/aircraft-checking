package com.aircraftbackend.entities;

import lombok.*;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@Table
public class Avion {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(unique = true, nullable = false)
    private String immatriculation;
    private String modele;

    @Enumerated(EnumType.STRING)
    private Statut statut;

    private LocalDate dateDerniereMaintenance;

    @OneToMany(mappedBy = "avion", cascade = CascadeType.ALL)
    @com.fasterxml.jackson.annotation.JsonManagedReference
    private List<Composant> composants;

    public enum Statut {
        ACTIF, MAINTENANCE, RETIRE
    }
}
