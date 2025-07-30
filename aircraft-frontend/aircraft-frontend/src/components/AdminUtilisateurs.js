import React, { useEffect, useState } from 'react';
import { getUtilisateurs, createUtilisateur, deleteUtilisateur, updateUtilisateur } from '../services/api';

export default function AdminUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ 
    prenom: '', 
    nom: '', 
    email: '', 
    password: '', 
    role: 'ADMIN', 
    id: null 
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });

  const fetchUtilisateurs = async () => {
    setLoading(true);
    try {
    const data = await getUtilisateurs();
    setUtilisateurs(data);
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors du chargement des utilisateurs." });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUtilisateurs();
  }, []);

  const openModal = (user = { 
    prenom: '', 
    nom: '', 
    email: '', 
    password: '', 
    role: 'ADMIN', 
    id: null 
  }) => {
    setForm(user);
    setEditMode(!!user.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ 
      prenom: '', 
      nom: '', 
      email: '', 
      password: '', 
      role: 'ADMIN', 
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
        await updateUtilisateur(form.id, form);
        setFeedback({ type: 'success', message: "Utilisateur modifié avec succès." });
      } else {
    await createUtilisateur(form);
        setFeedback({ type: 'success', message: "Utilisateur ajouté avec succès." });
      }
    fetchUtilisateurs();
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
      await deleteUtilisateur(confirmDelete.id);
      setFeedback({ type: 'success', message: "Utilisateur supprimé." });
    fetchUtilisateurs();
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors de la suppression." });
    }
    closeConfirmDelete();
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Liste des Utilisateurs</h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow flex items-center gap-2"
          onClick={() => openModal()}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ajouter un Utilisateur
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
                <th className="py-2 px-4 border-b">Prénom</th>
                <th className="py-2 px-4 border-b">Nom</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Rôle</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
          {utilisateurs.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{user.prenom}</td>
                  <td className="py-2 px-4 border-b">{user.nom}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.role}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      className="text-blue-600 hover:underline mr-2 flex items-center gap-1"
                      onClick={() => openModal(user)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Modifier
                    </button>
                    <button
                      className="text-red-600 hover:underline flex items-center gap-1"
                      onClick={() => openConfirmDelete(user.id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
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
            <h3 className="text-xl font-bold mb-4">{editMode ? 'Modifier' : 'Ajouter'} un Utilisateur</h3>
            <div className="mb-2">
              <input
                name="prenom"
                placeholder="Prénom"
                value={form.prenom}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-2">
              <input
                name="nom"
                placeholder="Nom"
                value={form.nom}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-2">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-2">
              <input
                name="password"
                type="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
                required={!editMode}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
          <option value="ADMIN">ADMIN</option>
          <option value="INGENIEUR">INGENIEUR</option>
          <option value="MECANICIEN">MECANICIEN</option>
        </select>
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
            <p className="mb-4">Voulez-vous vraiment supprimer cet utilisateur ?</p>
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