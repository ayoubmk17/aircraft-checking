import React, { useEffect, useState } from 'react';
import { getAvions, createAvion, deleteAvion, updateAvion } from '../services/api';

export default function AdminAvions() {
  const [avions, setAvions] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ 
    modele: '', 
    immatriculation: '', 
    statut: 'ACTIF',
    dateDerniereMaintenance: '',
    id: null 
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const fetchAvions = async () => {
    setLoading(true);
    try {
    const data = await getAvions();
    setAvions(data);
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors du chargement des données" });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAvions();
  }, []);

  const openModal = (avion = { 
    modele: '', 
    immatriculation: '', 
    statut: 'ACTIF',
    dateDerniereMaintenance: '',
    id: null 
  }) => {
    setForm(avion);
    setEditMode(!!avion.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ 
      modele: '', 
      immatriculation: '', 
      statut: 'ACTIF',
      dateDerniereMaintenance: '',
      id: null 
    });
    setEditMode(false);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editMode) {
        await updateAvion(form.id, form);
        setFeedback({ type: 'success', message: "Avion modifié avec succès." });
      } else {
    await createAvion(form);
        setFeedback({ type: 'success', message: "Avion ajouté avec succès." });
      }
    fetchAvions();
      closeModal();
    } catch (e) {
      setFeedback({ type: 'error', message: `Erreur lors de l'enregistrement: ${e.message}` });
    }
  };

  const openConfirmDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const closeConfirmDelete = () => {
    setConfirmDelete({ open: false, id: null });
  };

  const handleDelete = async () => {
    try {
      await deleteAvion(confirmDelete.id);
      setFeedback({ type: 'success', message: "Avion supprimé." });
    fetchAvions();
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors de la suppression." });
    }
    closeConfirmDelete();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gestion des Avions</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow flex items-center gap-2"
          onClick={() => openModal()}
        >
          <span className="text-lg font-bold">+</span> Ajouter un Avion
        </button>
      </div>
      {feedback && (
        <div className={`mb-4 p-2 rounded ${feedback.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{feedback.message}</div>
      )}
      {loading ? <p>Chargement...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">AVION</th>
                <th className="py-2 px-4 border-b">IMMATRICULATION</th>
                <th className="py-2 px-4 border-b">STATUT</th>
                <th className="py-2 px-4 border-b">DERNIÈRE MAINTENANCE</th>
                <th className="py-2 px-4 border-b">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
          {avions.map(avion => (
                <tr key={avion.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{avion.modele}</td>
                  <td className="py-2 px-4 border-b">{avion.immatriculation}</td>
                  <td className="py-2 px-4 border-b">{avion.statut}</td>
                  <td className="py-2 px-4 border-b">{avion.dateDerniereMaintenance}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => openModal(avion)}
                    >
                      Modifier
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => openConfirmDelete(avion.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
          ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal d'ajout/modification */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <form className="bg-white p-6 rounded shadow w-full max-w-md" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold mb-4">{editMode ? 'Modifier' : 'Ajouter'} un Avion</h3>
            <div className="mb-2">
              <input
                name="modele"
                placeholder="Modèle"
                value={form.modele}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-2">
              <input
                name="immatriculation"
                placeholder="Immatriculation"
                value={form.immatriculation}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-2">
              <select
                name="statut"
                value={form.statut}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="ACTIF">Actif</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="RETIRE">Retiré</option>
              </select>
            </div>
            <div className="mb-4">
              <input
                type="date"
                name="dateDerniereMaintenance"
                placeholder="Date dernière maintenance"
                value={form.dateDerniereMaintenance}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{editMode ? 'Modifier' : 'Ajouter'}</button>
            </div>
      </form>
        </div>
      )}
      {/* Modal de confirmation suppression */}
      {confirmDelete.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-sm">
            <p className="mb-4">Voulez-vous vraiment supprimer cet avion ?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={closeConfirmDelete} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 