import { api } from './api';

/**
 * Logout function - clears tokens and redirects to login
 */
export async function logout() {
  try {
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
    
    // Call logout API if refresh token exists
    if (refreshToken) {
      try {
        await api.post('/auth/logout', {}, {
          headers: {
            'Authorization': `Bearer ${refreshToken}`
          }
        });
      } catch (error) {
        // Ignore logout API errors, still clear local storage
        console.warn('Logout API call failed:', error);
      }
    }
  } catch (error) {
    console.warn('Logout error:', error);
  } finally {
    // Always clear local storage and redirect
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userUsername');
      // Redirect to home page (landing page)
      window.location.href = '/';
    }
  }
}

