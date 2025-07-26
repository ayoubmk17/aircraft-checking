package com.aircraftbackend.Repositories;

import com.aircraftbackend.entities.Avion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AvionRepository extends JpaRepository<Avion, Long>{
    Optional<Avion> findByModele(String modele);
}
