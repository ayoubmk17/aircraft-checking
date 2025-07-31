import React, { useState } from 'react';
import { login } from '../services/api';

export default function LoginPage({ onLoginSuccess }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Tentative de connexion avec:", credentials);
      const response = await login(credentials);
      console.log("Réponse du serveur:", response);
      
      if (response.success) {
        onLoginSuccess(response.user);
        setError("");
      } else {
        setError(response.message || "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      if (error.response) {
        // Erreur de réponse du serveur
        setError(`Erreur serveur: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        // Erreur de réseau
        setError("Erreur de connexion au serveur. Vérifiez que le backend est démarré sur localhost:8080");
      } else {
        // Autre erreur
        setError(`Erreur: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/ram-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        // Fallback en cas d'image manquante
        backgroundColor: '#1e3a8a'
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center">
            <img 
              src="/ram-logo.png" 
              alt="Royal Air Maroc Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-white">Aircraft Checking System</h2>
          <p className="mt-2 text-sm text-gray-200">Sign in to your account</p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={credentials.email}
                onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 