import React from "react";

export default function ModalVoirComposants({ avion, composants, onClose }) {
  const getEtatColor = (etat) => {
    switch (etat) {
      case 'OK':
        return 'bg-green-100 text-green-800';
      case 'ERREUR':
        return 'bg-red-100 text-red-800';
      case 'REPARE':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEtatIcon = (etat) => {
    switch (etat) {
      case 'OK':
        return '✅';
      case 'ERREUR':
        return '❌';
      case 'REPARE':
        return '🔧';
      default:
        return '❓';
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">
            Composants de l'avion {avion.modele} ({avion.immatriculation})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[60vh]">
          {composants.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun composant trouvé pour cet avion.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {composants.map((composant) => (
                <div
                  key={composant.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-lg">{composant.nom}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEtatColor(composant.etat)}`}>
                      {getEtatIcon(composant.etat)} {composant.etat}
                    </span>
                  </div>
                  {composant.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {composant.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500">
                    ID: {composant.id}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
} 