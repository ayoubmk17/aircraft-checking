import React, { useState, useEffect } from 'react';
import ModalReparerComposants from './ModalReparerComposants';
import { getAvions, getComposantsByAvion, updateComposant, updateAvion, createRapport, getRapports } from '../services/api';

export default function MechanicDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState('reparer');
  const [avions, setAvions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAvion, setSelectedAvion] = useState(null);
  const [composantsErreur, setComposantsErreur] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rapports, setRapports] = useState([]);

  // Charger avions et rapports
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
  const fetchRapports = async () => {
    try {
      const data = await getRapports();
      // Filtrer par mécanicien connecté
      setRapports(data.filter(r => r.mecanicien && r.mecanicien.id === currentUser.id));
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors du chargement des rapports." });
    }
  };
  useEffect(() => {
    fetchAvions();
    fetchRapports();
    // eslint-disable-next-line
  }, []);

  // Avions à réparer = statut MAINTENANCE + au moins un composant ERREUR
  const avionsAReparer = avions.filter(a => a.statut === 'MAINTENANCE');

  // Ouvre la modal de réparation
  const handleOpenModal = async (avion) => {
    setSelectedAvion(avion);
    setModalOpen(true);
    setLoading(true);
    try {
      const composants = await getComposantsByAvion(avion.id);
      setComposantsErreur(composants.filter(c => c.etat === 'ERREUR'));
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors du chargement des composants." });
      setComposantsErreur([]);
    }
    setLoading(false);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAvion(null);
    setComposantsErreur([]);
  };

  // Validation réparation
  const handleSaveReparation = async (repares, remarque) => {
    setLoading(true);
    try {
      console.log('Début réparation - Composants à réparer:', repares);
      console.log('Composants en erreur disponibles:', composantsErreur);
      
      // 1. Mettre à jour l'état des composants réparés
      await Promise.all(repares.map(async (id) => {
        const composant = composantsErreur.find(c => c.id === id);
        console.log('Mise à jour composant:', id, 'état actuel:', composant?.etat);
        
        if (!composant) {
          console.error('Composant non trouvé:', id);
          return;
        }
        
        const updatedComposant = {
          ...composant,
          etat: 'REPARE',
          avion: composant.avion ? { id: composant.avion.id } : { id: selectedAvion.id }
        };
        
        console.log('Payload de mise à jour:', updatedComposant);
        
        const result = await updateComposant(id, updatedComposant);
        console.log('Résultat mise à jour:', result);
      }));
      
      // 2. Vérifier si tous les composants de l'avion sont OK ou REPARE
      const allComposants = await getComposantsByAvion(selectedAvion.id);
      console.log('Tous les composants après mise à jour:', allComposants);
      
      const tousOkOuRepares = allComposants.every(c => c.etat === 'OK' || c.etat === 'REPARE');
      console.log('Tous OK ou réparés:', tousOkOuRepares);
      
      if (tousOkOuRepares) {
        await updateAvion(selectedAvion.id, { ...selectedAvion, statut: 'ACTIF' });
        console.log('Avion mis à jour vers ACTIF');
      }
      
      // 3. Créer un rapport de maintenance
      await createRapport({
        composant: null, // rapport global, ou tu peux boucler sur chaque composant réparé si besoin
        mecanicien: { id: currentUser.id },
        description: `Maintenance effectuée sur l'avion ${selectedAvion.modele} (${selectedAvion.immatriculation}) : ${repares.length} composant(s) réparé(s).\nRemarques : ${remarque}`,
        dateRapport: new Date().toISOString().slice(0, 10)
      });
      
      setFeedback({ type: 'success', message: "Réparation enregistrée et rapport généré." });
      fetchAvions();
      fetchRapports();
    } catch (e) {
      console.error('Erreur lors de la réparation:', e);
      setFeedback({ type: 'error', message: "Erreur lors de la réparation." });
    }
    handleCloseModal();
    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col gap-3">
        <div className="flex flex-col items-center mb-8">
          <img src="/ram-logo.png" alt="Logo" className="h-12 mb-2" />
          <span className="font-bold text-lg">Dashboard Mécanicien</span>
        </div>
        <div className="mb-8">
          <div className="text-sm text-gray-300">Connecté :</div>
          <div className="font-bold">{currentUser?.prenom} {currentUser?.nom}</div>
          <div className="text-xs text-blue-300">{currentUser?.role}</div>
        </div>
        <button onClick={() => setActiveTab('reparer')} className={`mb-2 px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'reparer' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>🛠️ Avions à réparer</button>
        <button onClick={() => setActiveTab('historique')} className={`mb-2 px-4 py-2 rounded flex items-center gap-2 ${activeTab === 'historique' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'}`}>📄 Historique interventions</button>
        <button onClick={onLogout} className="mt-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">Déconnexion</button>
      </nav>
      {/* Main */}
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        {feedback && (
          <div className={`mb-4 p-2 rounded ${feedback.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{feedback.message}</div>
        )}
        {activeTab === 'reparer' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Avions à réparer</h2>
            {loading ? <p>Chargement...</p> : (
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
                  {avionsAReparer.map(avion => (
                    <tr key={avion.id} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{avion.modele}</td>
                      <td className="py-2 px-4 border-b">{avion.immatriculation}</td>
                      <td className="py-2 px-4 border-b">{avion.statut}</td>
                      <td className="py-2 px-4 border-b">
                        <button onClick={() => handleOpenModal(avion)} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Réparer</button>
                      </td>
                    </tr>
                  ))}
                  {avionsAReparer.length === 0 && (
                    <tr><td colSpan={4} className="text-center py-4 text-gray-400">Aucun avion à réparer.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
        {activeTab === 'historique' && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Historique des interventions</h2>
            <table className="min-w-full bg-white border rounded shadow">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Date</th>
                  <th className="py-2 px-4 border-b">Description</th>
                </tr>
              </thead>
              <tbody>
                {rapports.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{r.dateRapport}</td>
                    <td className="py-2 px-4 border-b whitespace-pre-line">{r.description}</td>
                  </tr>
                ))}
                {rapports.length === 0 && (
                  <tr><td colSpan={2} className="text-center py-4 text-gray-400">Aucun rapport trouvé.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {/* Modal de réparation */}
        {modalOpen && selectedAvion && (
          <ModalReparerComposants
            avion={selectedAvion}
            composants={composantsErreur}
            onClose={handleCloseModal}
            onSave={handleSaveReparation}
          />
        )}
      </main>
    </div>
  );
} 