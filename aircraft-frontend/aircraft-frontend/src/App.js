import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    // Sauvegarder l'utilisateur dans le localStorage
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    // Supprimer l'utilisateur du localStorage
    localStorage.removeItem('user');
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <AdminDashboard
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
