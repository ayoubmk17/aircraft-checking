package com.aircraftbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Autowired;
import com.aircraftbackend.Repositories.UtilisateurRepository;
import com.aircraftbackend.entities.Utilisateur;
import com.aircraftbackend.entities.Utilisateur.Role;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class AircraftBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AircraftBackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner createAdminUser(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			String adminEmail = "admin@admin.com";
			if (utilisateurRepository.findByEmail(adminEmail).isEmpty()) {
				Utilisateur admin = new Utilisateur();
				admin.setPrenom("Admin");
				admin.setNom("Test");
				admin.setEmail(adminEmail);
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setRole(Role.ADMIN);
				utilisateurRepository.save(admin);
				System.out.println("Utilisateur admin de test créé: admin@admin.com / admin123");
			}
		};
	}
}
