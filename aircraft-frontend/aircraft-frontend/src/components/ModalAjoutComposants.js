import React, { useState } from "react";

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

export default function ModalAjoutComposants({ avion, onClose, onSave }) {
  const [selected, setSelected] = useState([]);

  const handleCheck = (modele) => {
    setSelected((prev) =>
      prev.includes(modele)
        ? prev.filter((m) => m !== modele)
        : [...prev, modele]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(selected);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-md"
      >
        <h3 className="text-xl font-bold mb-4">
          Ajouter des composants à l’avion {avion.modele} ({avion.immatriculation})
        </h3>
        <div className="mb-4 space-y-2">
          {MODELES_COMPOSANTS.map((modele) => (
            <label key={modele} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.includes(modele)}
                onChange={() => handleCheck(modele)}
                className="form-checkbox"
              />
              <span>{modele}</span>
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
            disabled={selected.length === 0}
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  );
} 