import React, { useState, useEffect, useRef } from 'react';
import { 
  getAvions, 
  createAvion, 
  updateAvion, 
  deleteAvion, 
  getRapports 
} from '../services/api';
import AdminUtilisateurs from '../components/AdminUtilisateurs';

function AdminDashboard({ currentUser, onLogout }) {
  const [activeTab, setActiveTab] = useState("avions");
  const [avions, setAvions] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAvionModal, setShowAvionModal] = useState(false);
  const [showRapportModal, setShowRapportModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAvion, setSelectedAvion] = useState(null);
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [avionToDelete, setAvionToDelete] = useState(null);
  const [error, setError] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef();

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    };
    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHistory]);

  // Charger les données au montage du composant
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [avionsData, rapportsData] = await Promise.all([
        getAvions(),
        getRapports()
      ]);
      setAvions(avionsData);
      setRapports(rapportsData);
    } catch (error) {
      setError("Erreur lors du chargement des données");
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAvion = () => {
    setSelectedAvion(null);
    setShowAvionModal(true);
  };

  const handleEditAvion = (avion) => {
    setSelectedAvion(avion);
    setShowAvionModal(true);
  };

  const handleDeleteAvion = (avion) => {
    setAvionToDelete(avion);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (avionToDelete) {
      try {
        await deleteAvion(avionToDelete.id);
        setAvions(avions.filter(a => a.id !== avionToDelete.id));
        setAvionToDelete(null);
        setShowDeleteDialog(false);
      } catch (error) {
        setError("Erreur lors de la suppression de l'avion");
      }
    }
  };

  const handleViewRapport = (rapport) => {
    setSelectedRapport(rapport);
    setShowRapportModal(true);
  };

  const getAvionName = (avionId) => {
    const avion = avions.find((a) => a.id === avionId);
    return avion ? `${avion.modele} (${avion.immatriculation})` : "Inconnu";
  };

  const handleSaveAvion = async (avionData) => {
    try {
      if (selectedAvion) {
        const updatedAvion = await updateAvion(selectedAvion.id, avionData);
        setAvions(avions.map(a => a.id === selectedAvion.id ? updatedAvion : a));
      } else {
        const newAvion = await createAvion(avionData);
        setAvions([...avions, newAvion]);
      }
      setShowAvionModal(false);
      setError(""); // Effacer les erreurs précédentes
    } catch (error) {
      console.error("Erreur API:", error);
      setError(`Erreur lors de la sauvegarde de l'avion: ${error.response?.data?.message || error.message || 'Erreur inconnue'}`);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen">
        <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 mb-8 p-3 bg-gray-700 rounded-lg">
            <img 
              src="/ram-logo.png" 
              alt="Logo" 
              className="w-10 h-8 object-contain"
            />
            <h2 className="text-lg font-bold text-blue-400">
              Dashboard Admin
            </h2>
          </div>
          
          {currentUser && (
            <div className="p-3 bg-gray-700 rounded-lg mb-6 text-sm">
              <p><strong>Connecté :</strong></p>
              <p>{currentUser.prenom} {currentUser.nom}</p>
              <p className="text-blue-400">{currentUser.role}</p>
            </div>
          )}
          
          <button className="p-3 text-left text-base transition-colors duration-200 rounded-lg bg-blue-600 text-white">
            ✈️ Gestion Avions
          </button>
          
          <button className="p-3 text-left text-base transition-colors duration-200 rounded-lg text-gray-300 hover:bg-gray-700">
            👥 Gestion Utilisateurs
          </button>
          
          <button className="p-3 text-left text-base transition-colors duration-200 rounded-lg text-gray-300 hover:bg-gray-700">
            📊 Rapports
          </button>
          
          <button className="p-3 text-left text-base transition-colors duration-200 rounded-lg text-gray-300 hover:bg-gray-700">
            🔔 Notifications
          </button>
          
          <div className="mt-auto pt-6">
            <button 
              onClick={onLogout}
              className="w-full p-3 bg-red-500 hover:bg-red-600 text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-200"
            >
              🚪 Déconnexion
            </button>
          </div>
        </nav>

        <main className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen" style={{
      backgroundImage: 'url(/ram-bg.png)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      {/* Overlay sombre pour uniformiser l'opacité */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      {/* Navbar verticale */}
      <nav className="w-64 bg-gray-800 text-white p-6 flex flex-col gap-3 relative z-10">
        {/* Header avec logo */}
        <div className="flex items-center gap-3 mb-8 p-3 bg-gray-700 rounded-lg">
          <img 
            src="/ram-logo.png" 
            alt="Logo" 
            className="w-10 h-8 object-contain"
          />
          <h2 className="text-lg font-bold text-blue-400">
            Dashboard Admin
          </h2>
        </div>
        
        {/* Informations utilisateur */}
        {currentUser && (
          <div className="p-3 bg-gray-700 rounded-lg mb-6 text-sm">
            <p><strong>Connecté :</strong></p>
            <p>{currentUser.prenom} {currentUser.nom}</p>
            <p className="text-blue-400">{currentUser.role}</p>
          </div>
        )}
        
        <button 
          onClick={() => setActiveTab("avions")}
          className={`p-3 text-left text-base transition-colors duration-200 rounded-lg ${
            activeTab === "avions" 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          ✈️ Gestion Avions
        </button>
        
        <button 
          onClick={() => setActiveTab("utilisateurs")}
          className={`p-3 text-left text-base transition-colors duration-200 rounded-lg ${
            activeTab === "utilisateurs" 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          👥 Gestion Utilisateurs
        </button>
        
        <button 
          onClick={() => setActiveTab("rapports")}
          className={`p-3 text-left text-base transition-colors duration-200 rounded-lg ${
            activeTab === "rapports" 
              ? 'bg-blue-600 text-white' 
              : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          📊 Rapports
        </button>
        
        
        {/* Bouton de déconnexion */}
        <div className="mt-auto pt-6">
          <button 
            onClick={onLogout}
            className="w-full p-3 bg-red-500 hover:bg-red-600 text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-200"
          >
            🚪 Déconnexion
          </button>
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="flex-1 p-6 overflow-auto relative z-10">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md bg-opacity-90">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Gestion Avions */}
        {activeTab === "avions" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gestion des Avions</h2>
              <div className="flex items-center gap-2 relative">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow flex items-center gap-2"
                  onClick={() => setShowHistory((v) => !v)}
                  title="Historique des créations"
                  style={{ minWidth: 120 }}
                >
                  <span className="font-bold">Historique</span>
                </button>
                <button
                  onClick={handleAddAvion}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter un Avion
                </button>
                {showHistory && (
                  <div ref={historyRef} className="absolute right-0 top-12 bg-white border rounded shadow-lg w-72 z-50">
                    <div className="p-3 border-b font-bold text-gray-700">5 derniers avions créés</div>
                    <ul className="max-h-60 overflow-y-auto">
                      {[...avions].sort((a, b) => b.id - a.id).slice(0, 5).map(avion => (
                        <li key={avion.id} className="px-4 py-2 hover:bg-gray-100 flex flex-col">
                          <span className="font-semibold">{avion.modele}</span>
                          <span className="text-xs text-gray-500">{avion.immatriculation}</span>
                        </li>
                      ))}
                      {avions.length === 0 && (
                        <li className="px-4 py-2 text-gray-400">Aucun avion</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md bg-opacity-90">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Immatriculation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dernière Maintenance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {avions.map((avion) => (
                      <tr key={avion.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{avion.modele}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{avion.immatriculation}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              avion.statut === "ACTIF" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {avion.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {avion.dateDerniereMaintenance || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          <button onClick={() => handleEditAvion(avion)} className="text-blue-600 hover:text-blue-900">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button onClick={() => handleDeleteAvion(avion)} className="text-red-600 hover:text-red-900">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Gestion Utilisateurs */}
        {activeTab === "utilisateurs" && (
          <div className="bg-white bg-opacity-90 shadow rounded-lg p-6">
            <AdminUtilisateurs />
          </div>
        )}

        {/* Rapports */}
        {activeTab === "rapports" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Tous les Rapports</h2>

            <div className="bg-white shadow overflow-hidden sm:rounded-md bg-opacity-90">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID Rapport
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avion
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingénieur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rapports.map((rapport) => (
                      <tr key={rapport.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{rapport.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getAvionName(rapport.avionId)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rapport.ingenieurNom}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rapport.dateRapport}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            {rapport.statut}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleViewRapport(rapport)} className="text-blue-600 hover:text-blue-900">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modal Avion */}
      {showAvionModal && (
        <AvionModal
          avion={selectedAvion}
          onClose={() => setShowAvionModal(false)}
          onSave={handleSaveAvion}
        />
      )}

      {/* Modal Rapport */}
      {showRapportModal && selectedRapport && (
        <RapportModal
          rapport={selectedRapport}
          avionName={getAvionName(selectedRapport.avionId)}
          onClose={() => setShowRapportModal(false)}
        />
      )}

      {/* Dialog de confirmation de suppression */}
      {showDeleteDialog && (
        <DeleteConfirmDialog
          avion={avionToDelete}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}
    </div>
  );
}

// Composant Modal pour Avion
function AvionModal({ avion, onClose, onSave }) {
  const [formData, setFormData] = useState({
    modele: avion?.modele || "",
    immatriculation: avion?.immatriculation || "",
    statut: avion?.statut || "ACTIF",
    dateDerniereMaintenance: avion?.dateDerniereMaintenance || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convertir la date en format ISO si elle existe
    const dataToSend = {
      ...formData,
      dateDerniereMaintenance: formData.dateDerniereMaintenance || null
    };
    
    onSave(dataToSend);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {avion ? "Modifier l'Avion" : "Ajouter un Avion"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Modèle</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.modele}
                onChange={(e) => setFormData((prev) => ({ ...prev, modele: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Immatriculation</label>
              <input
                type="text"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.immatriculation}
                onChange={(e) => setFormData((prev) => ({ ...prev, immatriculation: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Statut</label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.statut}
                onChange={(e) => setFormData((prev) => ({ ...prev, statut: e.target.value }))}
              >
                <option value="ACTIF">Actif</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RETIRE">Retiré</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Dernière Maintenance</label>
              <input
                type="date"
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.dateDerniereMaintenance}
                onChange={(e) => setFormData((prev) => ({ ...prev, dateDerniereMaintenance: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {avion ? "Mettre à jour" : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Composant Modal pour Rapport
function RapportModal({ rapport, avionName, onClose }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rapport #{rapport.id}</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Avion</h4>
              <p className="text-gray-600">{avionName}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Ingénieur</h4>
              <p className="text-gray-600">{rapport.ingenieurNom}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Date du Rapport</h4>
              <p className="text-gray-600">{rapport.dateRapport}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Description</h4>
              <p className="text-gray-600">{rapport.description}</p>
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant Dialog de confirmation de suppression
function DeleteConfirmDialog({ avion, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Supprimer l'Avion</h3>
          <p className="text-gray-600 mb-4">
            Êtes-vous sûr de vouloir supprimer {avion?.modele} ({avion?.immatriculation}) ? 
            Cette action ne peut pas être annulée.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 