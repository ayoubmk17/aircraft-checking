import React, { useEffect, useState } from 'react';
import { getComposants, updateComposant, getComposantsByAvion, updateAvion } from '../services/api';

const MechanicDashboard = ({ currentUser, onLogout }) => {
  const [composantsErreur, setComposantsErreur] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComposantsErreur();
  }, []);

  const fetchComposantsErreur = async () => {
    setLoading(true);
    try {
      const allComposants = await getComposants();
      const defectueux = allComposants.filter(c => c.etat === 'ERREUR');
      setComposantsErreur(defectueux);
    } catch (error) {
      console.error('Erreur lors du chargement des composants:', error);
    }
    setLoading(false);
  };

  const handleReparer = async (comp) => {
    try {
      // 1. Mettre à jour le composant à "REPARE"
      const updated = {
        ...comp,
        etat: 'REPARE',
        avion: comp.avion ? { id: comp.avion.id } : null,
      };
      await updateComposant(comp.id, updated);

      // 2. Récupérer tous les composants de l'avion concerné
      const avionId = comp.avion?.id;
      if (avionId) {
        const composantsAvion = await getComposantsByAvion(avionId);
        // 3. Vérifier que tous les composants sont OK ou REPARE
        const allOk = composantsAvion.every(c => c.etat === 'OK' || c.etat === 'REPARE');
        if (allOk) {
          // 4. Construire un objet avion minimal à partir d'un composant pour mise à jour
          const avionRef = composantsAvion[0].avion;
          const avionToUpdate = {
            id: avionId,
            immatriculation: avionRef?.immatriculation || '',
            modele: avionRef?.modele || '',
            statut: 'ACTIF',
            dateDerniereMaintenance: avionRef?.dateDerniereMaintenance || null,
            composants: []
          };
          await updateAvion(avionId, avionToUpdate);
          console.log(`Avion ${avionId} mis à jour avec statut ACTIF`);
        }
      }
      // 5. Rafraîchir la liste des composants en erreur
      fetchComposantsErreur();
    } catch (error) {
      console.error('Erreur lors de la réparation du composant:', error);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar harmonisée */}
      <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col gap-3">
        <div className="flex flex-col items-center mb-8">
          <img src="/ram-logo.png" alt="Logo" className="h-12 mb-2" />
          <span className="font-bold text-lg">Dashboard Mécanicien</span>
        </div>
        {currentUser && (
          <div className="mb-8">
            <div className="text-sm text-gray-300">Connecté :</div>
            <div className="font-bold">{currentUser.prenom} {currentUser.nom}</div>
            <div className="text-xs text-blue-300">{currentUser.role}</div>
          </div>
        )}
        <button onClick={onLogout} className="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Déconnexion</button>
      </nav>
      {/* Main */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Composants en erreur</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Chargement...</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avion</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {composantsErreur.map((comp) => (
                    <tr key={comp.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comp.nom}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.avion?.immatriculation || 'Non assigné'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{comp.etat}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                        <button
                          onClick={() => handleReparer(comp)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                        >
                          Réparer
                        </button>
                      </td>
                    </tr>
                  ))}
                  {composantsErreur.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-400">
                        Aucun composant en erreur.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MechanicDashboard;
