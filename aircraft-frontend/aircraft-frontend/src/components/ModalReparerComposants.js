import React, { useState } from "react";

export default function ModalReparerComposants({ avion, composants, onClose, onSave }) {
  // composants: liste [{id, nom, etat, ...}] (seulement ceux en ERREUR)
  const [repares, setRepares] = useState([]);
  const [remarque, setRemarque] = useState("");

  const handleCheck = (id) => {
    setRepares((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(repares, remarque);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h3 className="text-xl font-bold mb-4">
          Réparation des composants de l’avion {avion.modele} ({avion.immatriculation})
        </h3>
        <div className="mb-4 space-y-2">
          {composants.length === 0 ? (
            <div className="text-gray-500">Aucun composant à réparer.</div>
          ) : composants.map((c) => (
            <label key={c.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={repares.includes(c.id)}
                onChange={() => handleCheck(c.id)}
                className="form-checkbox"
              />
              <span>{c.nom}</span>
            </label>
          ))}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Remarques (optionnel)</label>
          <textarea
            className="w-full border rounded p-2"
            value={remarque}
            onChange={e => setRemarque(e.target.value)}
            rows={2}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
            disabled={repares.length === 0}
          >
            Valider la réparation
          </button>
        </div>
      </form>
    </div>
  );
} 