import axios from 'axios';

const API_URL = "http://localhost:8080/api";

// Configuration axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter l'authentification
api.interceptors.request.use(
  (config) => {
    // Récupérer les informations utilisateur du localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.email) {
      // Pour l'instant, on peut utiliser Basic Auth ou un token
      // config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Rediriger vers la page de login si non authentifié
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export async function getAvions() {
  const response = await api.get('/avions');
  return response.data;
}

export async function getAvionById(id) {
  const response = await api.get(`/avions/${id}`);
  return response.data;
}

export async function createAvion(data) {
  const response = await api.post('/avions', data);
  return response.data;
}

export async function deleteAvion(id) {
  const response = await api.delete(`/avions/${id}`);
  return response.status === 200;
}

export async function updateAvion(id, data) {
  const response = await api.put(`/avions/${id}`, data);
  return response.data;
}

// COMPOSANTS
export async function getComposants() {
  const response = await api.get('/composants');
  return response.data;
}

export async function getComposantById(id) {
  const response = await api.get(`/composants/${id}`);
  return response.data;
}

export async function getComposantsByAvion(avionId) {
  const response = await api.get(`/composants/${avionId}`);
  return response.data;
}

export async function createComposant(data) {
  const response = await api.post('/composants', data);
  return response.data;
}

export async function deleteComposant(id) {
  const response = await api.delete(`/composants/${id}`);
  return response.status === 200;
}

// RAPPORTS
export async function getRapports() {
  const response = await api.get('/rapports');
  return response.data;
}

export async function getRapportById(id) {
  const response = await api.get(`/rapports/${id}`);
  return response.data;
}

export async function createRapport(data) {
  const response = await api.post('/rapports', data);
  return response.data;
}

export async function deleteRapport(id) {
  const response = await api.delete(`/rapports/${id}`);
  return response.status === 200;
}

// NOTIFICATIONS (mock, à adapter selon backend)
export async function getNotifications() {
  // À remplacer par un vrai endpoint si disponible
  return [
    { id: 1, message: "Nouveau rapport reçu pour l'avion X." },
    { id: 2, message: "Maintenance terminée pour l'avion Y." }
  ];
}

// AUTHENTIFICATION
export async function login(credentials) {
  try {
    console.log("Envoi de la requête de login à:", `${API_URL}/auth/login`);
    console.log("Données envoyées:", credentials);
    
    const response = await api.post('/auth/login', credentials);
    console.log("Réponse reçue:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Erreur dans la fonction login:", error);
    throw error;
  }
}

// UTILISATEURS
export async function getUtilisateurs() {
  const response = await api.get('/users');
  return response.data;
}

export async function getUtilisateurById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function createUtilisateur(data) {
  const response = await api.post('/users', data);
  return response.data;
}

export async function deleteUtilisateur(id) {
  const response = await api.delete(`/users/${id}`);
  return response.status === 200;
}

export async function updateUtilisateur(id, data) {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
}