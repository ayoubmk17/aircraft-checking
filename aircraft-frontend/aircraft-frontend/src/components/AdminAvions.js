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

  const handleDelete = async id => {
    if (!window.confirm("Supprimer cet avion ?")) return;
    try {
      await deleteAvion(id);
      setFeedback({ type: 'success', message: "Avion supprimé." });
      fetchAvions();
    } catch (e) {
      setFeedback({ type: 'error', message: "Erreur lors de la suppression." });
    }
  };

  return (
    <div>
      <h2>Liste des Avions</h2>
      {feedback && <div style={{color: feedback.type === 'error' ? 'red' : 'green'}}>{feedback.message}</div>}
      <button onClick={() => openModal()}>Ajouter un Avion</button>
      {loading ? <p>Chargement...</p> : (
        <table border="1" cellPadding="8" style={{marginTop:16}}>
          <thead>
            <tr>
              <th>Modèle</th>
              <th>Immatriculation</th>
              <th>Statut</th>
              <th>Date dernière maintenance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {avions.map(avion => (
              <tr key={avion.id}>
                <td>{avion.modele}</td>
                <td>{avion.immatriculation}</td>
                <td>{avion.statut}</td>
                <td>{avion.dateDerniereMaintenance}</td>
                <td>
                  <button onClick={() => openModal(avion)}>Modifier</button>
                  <button onClick={() => handleDelete(avion.id)} style={{marginLeft:8}}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {modalOpen && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <form onSubmit={handleSubmit} style={{background:'#fff',padding:24,borderRadius:8,minWidth:300,display:'flex',flexDirection:'column',gap:12}}>
            <h3>{editMode ? 'Modifier' : 'Ajouter'} un Avion</h3>
            <input 
              name="modele" 
              placeholder="Modèle" 
              value={form.modele} 
              onChange={handleChange} 
              required 
            />
            <input 
              name="immatriculation" 
              placeholder="Immatriculation" 
              value={form.immatriculation} 
              onChange={handleChange} 
              required 
            />
            <select 
              name="statut" 
              value={form.statut} 
              onChange={handleChange} 
              required
            >
              <option value="ACTIF">Actif</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RETIRE">Retiré</option>
            </select>
            <input 
              type="date" 
              name="dateDerniereMaintenance" 
              placeholder="Date dernière maintenance" 
              value={form.dateDerniereMaintenance} 
              onChange={handleChange} 
            />
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