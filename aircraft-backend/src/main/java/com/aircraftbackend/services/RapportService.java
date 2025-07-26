package com.aircraftbackend.services;

import com.aircraftbackend.Repositories.RapportRepository;
import com.aircraftbackend.entities.Rapport;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RapportService {
    private final RapportRepository rapportRepository;

    public RapportService(RapportRepository rapportRepository) {this.rapportRepository = rapportRepository;}

    public List<Rapport> getAll(){return rapportRepository.findAll();}

    public Optional<Rapport> getById(Long id){return rapportRepository.findById(id);}

    public Rapport create(Rapport rapport){return rapportRepository.save(rapport);}

    public void delete(Long id){rapportRepository.deleteById(id);}
}
