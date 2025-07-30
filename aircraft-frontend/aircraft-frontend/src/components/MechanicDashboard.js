import React, { useEffect, useState } from 'react';
import { getComposants, updateComposant, getComposantsByAvion, updateAvion, getAvions } from '../services/api';

const MechanicDashboard = ({ currentUser, onLogout }) => {
  const [avions, setAvions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAvion, setSelectedAvion] = useState(null);
  const [showComposants, setShowComposants] = useState(false);

  useEffect(() => {
    fetchAvionsWithComposants();
  }, []);

  const fetchAvionsWithComposants = async () => {
    setLoading(true);
    try {
      console.log('Début fetchAvionsWithComposants');
      const avionsData = await getAvions();
      console.log('Avions reçus:', avionsData);
      
      // Récupérer les composants pour chaque avion individuellement
      const avionsWithStats = await Promise.all(
        avionsData.map(async (avion) => {
          try {
            const composantsAvion = await getComposantsByAvion(avion.id);
            const composantsErreur = composantsAvion.filter(c => c.etat === 'ERREUR');
            
            console.log(`Avion ${avion.id} (${avion.modele}): ${composantsAvion.length} composants, ${composantsErreur.length} en erreur`);
            console.log('Composants de cet avion:', composantsAvion);
            
            return {
              ...avion,
              totalComposants: composantsAvion.length,
              composantsErreur: composantsErreur.length,
              composants: composantsAvion
            };
          } catch (error) {
            console.error(`Erreur pour l'avion ${avion.id}:`, error);
            return {
              ...avion,
              totalComposants: 0,
              composantsErreur: 0,
              composants: []
            };
          }
        })
      );
      
      console.log('Avions avec stats:', avionsWithStats);
      setAvions(avionsWithStats);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
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
      // 5. Rafraîchir les données
      fetchAvionsWithComposants();
      // 6. Mettre à jour la vue des composants si on est dans le modal
      if (selectedAvion) {
        const updatedAvion = avions.find(a => a.id === selectedAvion.id);
        if (updatedAvion) {
          setSelectedAvion(updatedAvion);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la réparation du composant:', error);
    }
  };

  const handleShowComposants = (avion) => {
    setSelectedAvion(avion);
    setShowComposants(true);
  };

  const handleCloseComposants = () => {
    setShowComposants(false);
    setSelectedAvion(null);
  };

  return (
    <div className="flex h-screen" style={{
      backgroundImage: 'url(/ram-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Overlay sombre pour uniformiser l'opacité */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Sidebar harmonisée */}
      <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col gap-3 relative z-10">
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
      <main className="flex-1 p-6 overflow-auto relative z-10">
        {!showComposants ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-white">Avions avec composants en erreur</h2>
            <div className="bg-white bg-opacity-90 shadow overflow-hidden sm:rounded-md">
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avion</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Immatriculation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Composants</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Composants en Erreur</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {avions.filter(avion => avion.composantsErreur > 0).map((avion) => (
                        <tr key={avion.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{avion.modele}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{avion.immatriculation}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              avion.statut === "ACTIF" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {avion.statut}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{avion.totalComposants}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{avion.composantsErreur}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2 text-center">
                            <button
                              onClick={() => handleShowComposants(avion)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                            >
                              Réparer
                            </button>
                          </td>
                        </tr>
                      ))}
                      {avions.filter(avion => avion.composantsErreur > 0).length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-4 text-gray-400">
                            Aucun avion avec des composants en erreur.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">
                Composants en erreur - {selectedAvion?.modele} ({selectedAvion?.immatriculation})
              </h2>
              <button
                onClick={handleCloseComposants}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Retour
              </button>
            </div>
            <div className="bg-white bg-opacity-90 shadow overflow-hidden sm:rounded-md">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">État</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedAvion?.composants.filter(c => c.etat === 'ERREUR').map((comp) => (
                      <tr key={comp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{comp.nom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comp.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {comp.etat}
                          </span>
                        </td>
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
                    {selectedAvion?.composants.filter(c => c.etat === 'ERREUR').length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-gray-400">
                          Aucun composant en erreur pour cet avion.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MechanicDashboard;
