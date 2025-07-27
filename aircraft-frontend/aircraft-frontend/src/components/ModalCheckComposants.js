import React, { useState } from "react";

export default function ModalCheckComposants({ avion, composants, onClose, onSave }) {
  // composants: liste [{id, nom, etat, ...}]
  const [nokIds, setNokIds] = useState(
    composants.filter(c => c.etat === 'ERREUR').map(c => c.id)
  );

  const handleCheck = (id) => {
    setNokIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // On retourne la liste des ids NOK
    onSave(nokIds);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h3 className="text-xl font-bold mb-4">
          Vérification des composants de l’avion {avion.modele} ({avion.immatriculation})
        </h3>
        <div className="mb-4 space-y-2">
          {composants.map((c) => (
            <label key={c.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={nokIds.includes(c.id)}
                onChange={() => handleCheck(c.id)}
                className="form-checkbox"
              />
              <span>{c.nom} <span className="text-xs text-gray-500">[{c.etat}]</span></span>
            </label>
          ))}
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
            disabled={composants.length === 0}
          >
            Valider le checking
          </button>
        </div>
      </form>
    </div>
  );
} 