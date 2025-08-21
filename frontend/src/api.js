import { auth } from './firebase';

export const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    const token = await auth.currentUser.getIdToken(true);
    console.log('🔑 Token récupéré:', token.substring(0, 50) + '...');
    
    const response = fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📡 Response status:', (await response).status);
    return response;
  } catch (error) {
    console.error('❌ Erreur token:', error);
    throw error;
  }
};

export const apiGet = (url) => makeAuthenticatedRequest(url);

export const apiPost = (url, data) => makeAuthenticatedRequest(url, {
  method: 'POST',
  body: JSON.stringify(data)
});