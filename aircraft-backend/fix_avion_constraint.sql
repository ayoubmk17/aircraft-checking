-- Script pour corriger la contrainte de vérification sur la table avion
-- Exécutez ce script dans votre base de données PostgreSQL

-- Supprimer l'ancienne contrainte
ALTER TABLE avion DROP CONSTRAINT IF EXISTS avion_statut_check;

-- Ajouter la nouvelle contrainte avec les bons statuts
ALTER TABLE avion ADD CONSTRAINT avion_statut_check 
CHECK (statut IN ('ACTIF', 'MAINTENANCE', 'RETIRE'));

-- Vérifier que la contrainte a été mise à jour
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'avion'::regclass AND contype = 'c'; 