package com.aircraftbackend.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Data
@Table
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String prenom;
    private String nom;

    @Column(unique = true)
    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    public enum Role {
        ADMIN, INGENIEUR, MECANICIEN
    }
    @OneToMany
    @JsonIgnore
    private List<Avion> avions;

}
