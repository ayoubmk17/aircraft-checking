package com.aircraftbackend.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@Table
public class Composant {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nom;
    private String description;

    @Enumerated(EnumType.STRING)
    private Etat etat;

    @ManyToOne
    @JoinColumn(name = "avion_id")
    @com.fasterxml.jackson.annotation.JsonBackReference
    private Avion avion;

    public enum Etat {
        OK, ERREUR, REPARE
    }
}
