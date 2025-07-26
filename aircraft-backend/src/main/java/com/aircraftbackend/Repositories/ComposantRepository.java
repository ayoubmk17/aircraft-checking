package com.aircraftbackend.Repositories;

import com.aircraftbackend.entities.Composant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComposantRepository extends JpaRepository<Composant, Long> {
    Optional<Composant> findByNom(String nom);

    List<Composant> findAllByAvion_Id(Long avionId);
}
