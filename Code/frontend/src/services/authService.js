// src/services/authService.js
export function getAccessToken() {
    return localStorage.getItem('access_token');
  }
  
  export function getRefreshToken() {
    return localStorage.getItem('refresh_token');
  }
  
  export function setAccessToken(token) {
    localStorage.setItem('access_token', token);
  }
  
  export async function refreshAccessToken() {
    const refresh = getRefreshToken();
    if (!refresh) return false;
  
    try {
      const response = await fetch('http://localhost:8000/auth/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Erro ao renovar token:', err);
      return false;
    }
  }
  