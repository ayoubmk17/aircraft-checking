import React, { useState, useEffect, useRef } from 'react';
import ModalAjoutComposants from './ModalAjoutComposants';
import ModalCheckComposants from './ModalCheckComposants';
import ModalVoirComposants from './ModalVoirComposants';
import { getAvions, getComposants, createComposant, getComposantsByAvion, updateComposant, updateAvion, createRapport } from '../services/api';

export default function EngineerDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('nouveaux');
  const [avions, setAvions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAvion, setSelectedAvion] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalCheckOpen, setModalCheckOpen] = useState(false);
  const [selectedAvionCheck, setSelectedAvionCheck] = useState(null);
  const [composantsCheck, setComposantsCheck] = useState([]);
  const [modalVoirOpen, setModalVoirOpen] = useState(false);
  const [selectedAvionVoir, setSelectedAvionVoir] = useState(null);
  const [composantsVoir, setComposantsVoir] = useState([]);

  // Liste des modèles de composants (doit être identique à ModalAjoutComposants.js)
  const MODELES_COMPOSANTS = [
    "Moteur",
    "Aile gauche",
    "Aile droite",
    "Train d’atterrissage",
    "Système hydraulique",
    "Système électrique",
    "Fuselage",
    "Cockpit",
  ];

  // Fonction utilitaire pour savoir si tous les modèles sont présents pour un avion
  const [composantsParAvion, setComposantsParAvion] = useState({});

  // Charger les composants d'un avion à la volée
  const fetchComposantsForAvion = async (avionId) => {
    if (!composantsParAvion[avionId]) {
      try {
        const composants = await getComposantsByAvion(avionId);
        setComposantsParAvion(prev => ({ ...prev, [avionId]: composants }));
        return composants;
      } catch (e) {
        return [];
      }
    }
    return composantsParAvion[avionId];
  };

  // Vérifie si tous les modèles sont présents pour un avion
  const hasAllComposants = (avionId) => {
    if (!composantsParAvion[avionId]) return false; // On ne sait pas, donc on laisse actif
    const composants = composantsParAvion[avionId];
    const modelesPresents = composants.map(c => c.nom);
    return MODELES_COMPOSANTS.every(modele => modelesPresents.includes(modele));
  };

  // Charger tous les avions
  const fetchAvions = async () => {
    setLoading(true);
    try {
      const data = await getAvions();
      setAvions(data);
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors du chargement des avions." });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAvions();
  }, []);

  // Avions à checker (statut ACTIF)
  const avionsNouveaux = avions.filter(a => a.statut === 'ACTIF');
  // Avions en maintenance (statut MAINTENANCE)
  const avionsMaintenance = avions.filter(a => a.statut === 'MAINTENANCE');

  // Ouvre le modal d'ajout de composants
  const handleOpenModal = async (avion) => {
    // Charger les composants de l'avion avant d'ouvrir le modal
    await fetchComposantsForAvion(avion.id);
    setSelectedAvion(avion);
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAvion(null);
  };

  // Ajoute les composants sélectionnés à l'avion
  const handleSaveComposants = async (modeles) => {
    try {
      await Promise.all(modeles.map(modele => createComposant({
        nom: modele,
        avion: { id: selectedAvion.id },
        etat: 'OK'
      })));
      setFeedback({ type: 'success', message: "Composants ajoutés avec succès." });
      fetchAvions();
      // Rafraîchir la liste des composants pour cet avion
      const composants = await getComposantsByAvion(selectedAvion.id);
      setComposantsParAvion(prev => ({ ...prev, [selectedAvion.id]: composants }));
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors de l'ajout des composants." });
    }
    handleCloseModal();
  };

  // Ouvre le modal de checking des composants NOK
  const handleOpenCheckModal = async (avion) => {
    setSelectedAvionCheck(avion);
    setModalCheckOpen(true);
    setLoading(true);
    try {
      const composants = await getComposantsByAvion(avion.id);
      setComposantsCheck(composants);
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors du chargement des composants." });
      setComposantsCheck([]);
    }
    setLoading(false);
  };
  const handleCloseCheckModal = () => {
    setModalCheckOpen(false);
    setSelectedAvionCheck(null);
    setComposantsCheck([]);
  };

  // Validation du checking
  const handleSaveChecking = async (nokIds) => {
    setLoading(true);
    try {
      // 1. Mettre à jour l'état de chaque composant
      await Promise.all(composantsCheck.map(async (c) => {
        const newEtat = nokIds.includes(c.id) ? 'ERREUR' : 'OK';
        if (c.etat !== newEtat) {
          await updateComposant(c.id, {
            ...c,
            etat: newEtat,
            avion: c.avion ? { id: c.avion.id } : { id: selectedAvionCheck.id }
          });
        }
      }));
      // 2. Si au moins un NOK, créer un rapport pour chaque NOK
      if (nokIds.length > 0) {
        await Promise.all(nokIds.map(async (id) => {
          await createRapport({
            composant: { id },
            engineer: { id: currentUser.id },
            description: `Composant défectueux détecté lors du checking par l'ingénieur ${currentUser.prenom} ${currentUser.nom}`,
            dateRapport: new Date().toISOString().slice(0, 10)
          });
        }));
        // L'avion reste en MAINTENANCE
        setFeedback({ type: 'success', message: "Composants NOK signalés et rapports générés." });
      } else {
        // Tous OK : repasser l'avion à ACTIF
        await updateAvion(selectedAvionCheck.id, { ...selectedAvionCheck, statut: 'ACTIF' });
        setFeedback({ type: 'success', message: "Tous les composants sont OK. L'avion est prêt." });
      }
      fetchAvions();
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors du checking des composants." });
    }
    handleCloseCheckModal();
    setLoading(false);
  };

  // Ouvre le modal pour voir les composants
  const handleOpenVoirModal = async (avion) => {
    setSelectedAvionVoir(avion);
    setModalVoirOpen(true);
    setLoading(true);
    try {
      const composants = await getComposantsByAvion(avion.id);
      setComposantsVoir(composants);
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors du chargement des composants." });
      setComposantsVoir([]);
    }
    setLoading(false);
  };
  const handleCloseVoirModal = () => {
    setModalVoirOpen(false);
    setSelectedAvionVoir(null);
    setComposantsVoir([]);
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
      
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col gap-3 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img src="/ram-logo.png" alt="Logo" className="h-12 mb-2" />
          <span className="font-bold text-lg">Dashboard Ingénieur</span>
        </div>
        <div className="mb-8">
          <div className="text-sm text-gray-300">Connecté :</div>
          <div className="font-bold">{currentUser?.prenom} {currentUser?.nom}</div>
          <div className="text-xs text-blue-300">{currentUser?.role}</div>
        </div>
        <button onClick={() => setActiveTab('nouveaux')} className={`mb-2 px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'nouveaux' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>🆕 Nouveaux Avions</button>
        <button onClick={() => setActiveTab('maintenance')} className={`mb-2 px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'maintenance' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>🛠️ Avions en Maintenance</button>
        <button onClick={onLogout} className="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Déconnexion</button>
      </nav>
      {/* Main */}
      <main className="flex-1 p-6 overflow-auto relative z-10">
        {feedback && (
          <div className={`mb-4 p-2 rounded bg-opacity-90 ${feedback.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{feedback.message}</div>
        )}
        {activeTab === 'nouveaux' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Nouveaux Avions à Checker</h2>
            {loading ? <p className="text-white">Chargement...</p> : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md bg-opacity-90">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Modèle</th>
                      <th className="py-2 px-4 border-b">Immatriculation</th>
                      <th className="py-2 px-4 border-b">Statut</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avionsNouveaux.map(avion => (
                      <tr key={avion.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{avion.modele}</td>
                        <td className="py-2 px-4 border-b">{avion.immatriculation}</td>
                        <td className="py-2 px-4 border-b">{avion.statut}</td>
                        <td className="py-2 px-4 border-b">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleOpenVoirModal(avion)}
                              className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                            >
                              Voir Composants
                            </button>
                            <button
                              onClick={() => handleOpenModal(avion)}
                              className={`px-3 py-1 rounded ${hasAllComposants(avion.id) ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                              disabled={hasAllComposants(avion.id)}
                              onMouseEnter={() => fetchComposantsForAvion(avion.id)}
                            >
                              Ajouter des composants
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {avionsNouveaux.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-4 text-gray-400">Aucun nouvel avion à checker.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {activeTab === 'maintenance' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-white">Avions en Maintenance</h2>
            {loading ? <p className="text-white">Chargement...</p> : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md bg-opacity-90">
                <table className="min-w-full bg-white border rounded shadow">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 border-b">Modèle</th>
                      <th className="py-2 px-4 border-b">Immatriculation</th>
                      <th className="py-2 px-4 border-b">Statut</th>
                      <th className="py-2 px-4 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avionsMaintenance.map(avion => (
                      <tr key={avion.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b">{avion.modele}</td>
                        <td className="py-2 px-4 border-b">{avion.immatriculation}</td>
                        <td className="py-2 px-4 border-b">{avion.statut}</td>
                        <td className="py-2 px-4 border-b">
                          <button onClick={() => handleOpenCheckModal(avion)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Vérifier</button>
                        </td>
                      </tr>
                    ))}
                    {avionsMaintenance.length === 0 && (
                      <tr><td colSpan={4} className="text-center py-4 text-gray-400">Aucun avion en maintenance.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        {/* Modal d'ajout de composants */}
        {modalOpen && selectedAvion && (
          <ModalAjoutComposants
            avion={selectedAvion}
            onClose={handleCloseModal}
            onSave={handleSaveComposants}
            modelesDejaPresents={
              (composantsParAvion[selectedAvion.id] || []).map(c => c.nom)
            }
          />
        )}
        {/* Modal de checking des composants NOK */}
        {modalCheckOpen && selectedAvionCheck && (
          <ModalCheckComposants
            avion={selectedAvionCheck}
            composants={composantsCheck}
            onClose={handleCloseCheckModal}
            onSave={handleSaveChecking}
          />
        )}
        {/* Modal pour voir les composants */}
        {modalVoirOpen && selectedAvionVoir && (
          <ModalVoirComposants
            avion={selectedAvionVoir}
            composants={composantsVoir}
            onClose={handleCloseVoirModal}
          />
        )}
      </main>
    </div>
  );
} 