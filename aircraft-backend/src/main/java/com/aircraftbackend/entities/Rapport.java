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
    @JsonIgnore
    private Composant composant;

    @ManyToOne
    @JsonIgnore
    private Utilisateur engineer;

    @ManyToOne
    @JsonIgnore
    private Utilisateur mecanicien;

    private String description;
    private LocalDate dateRapport;
}
