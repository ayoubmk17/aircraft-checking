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

  const handleDelete = async id => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUtilisateur(id);
      setFeedback({ type: 'success', message: "Utilisateur supprimé." });
      fetchUtilisateurs();
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors de la suppression." });
    }
  };

  return (
    <div>
      <h2>Liste des Utilisateurs</h2>
      {feedback && <div style={{color: feedback.type === 'error' ? 'red' : 'green'}}>{feedback.message}</div>}
      <button onClick={() => openModal()}>Ajouter un Utilisateur</button>
      {loading ? <p>Chargement...</p> : (
        <table border="1" cellPadding="8" style={{marginTop:16}}>
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map(user => (
              <tr key={user.id}>
                <td>{user.prenom}</td>
                <td>{user.nom}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => openModal(user)}>Modifier</button>
                  <button onClick={() => handleDelete(user.id)} style={{marginLeft:8}}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modalOpen && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <form onSubmit={handleSubmit} style={{background:'#fff',padding:24,borderRadius:8,minWidth:300,display:'flex',flexDirection:'column',gap:12}}>
            <h3>{editMode ? 'Modifier' : 'Ajouter'} un Utilisateur</h3>
            <input 
              name="prenom" 
              placeholder="Prénom" 
              value={form.prenom} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="nom" 
              placeholder="Nom" 
              value={form.nom} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="email" 
              type="email" 
              placeholder="Email" 
              value={form.email} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="password" 
              type="password" 
              placeholder="Mot de passe" 
              value={form.password} 
              onChange={handleChange} 
              required={!editMode}
            />
            <select 
              name="role" 
              value={form.role} 
              onChange={handleChange} 
              required
            >
              <option value="ADMIN">ADMIN</option>
              <option value="INGENIEUR">INGENIEUR</option>
              <option value="MECANICIEN">MECANICIEN</option>
            </select>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button type="button" onClick={closeModal}>Annuler</button>
              <button type="submit">{editMode ? 'Modifier' : 'Ajouter'}</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
} 