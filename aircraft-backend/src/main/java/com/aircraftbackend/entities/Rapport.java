package com.aircraftbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@Table
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private Composant composant;

    @ManyToOne
    private Utilisateur engineer;

    @ManyToOne
    private Utilisateur mecanicien;

    private String description;
    private LocalDate dateRapport;
}
