import React, { useEffect, useState } from 'react';
import { getComposants, updateComposant } from '../services/api';

const MechanicDashboard = () => {
  const [composantsErreur, setComposantsErreur] = useState([]);

  useEffect(() => {
    fetchComposantsErreur();
  }, []);

  const fetchComposantsErreur = async () => {
    try {
      const allComposants = await getComposants();
      const defectueux = allComposants.filter(c => c.etat === 'ERREUR');
      setComposantsErreur(defectueux);
    } catch (error) {
      console.error('Erreur lors du chargement des composants:', error);
    }
  };

  const handleReparer = async (comp) => {
    try {
      const updated = {
        ...comp,
        etat: 'REPARE',
        avion: comp.avion ? { id: comp.avion.id } : null,
      };
      await updateComposant(comp.id, updated);
      fetchComposantsErreur();
    } catch (error) {
      console.error('Erreur lors de la réparation du composant:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Composants en erreur</h2>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Avion</th>
            <th className="p-2 border">État</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {composantsErreur.map((comp) => (
            <tr key={comp.id}>
              <td className="p-2 border">{comp.nom}</td>
              <td className="p-2 border">{comp.description}</td>
              <td className="p-2 border">{comp.avion?.nom || 'Non assigné'}</td>
              <td className="p-2 border">{comp.etat}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleReparer(comp)}
                  className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                >
                  Réparer
                </button>
              </td>
            </tr>
          ))}
          {composantsErreur.length === 0 && (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-500">
                Aucun composant en erreur.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MechanicDashboard;
