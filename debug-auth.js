// Quick debug script to check auth state
console.log('=== AUTH DEBUG ===');
console.log('healthcare_user:', localStorage.getItem('healthcare_user'));
console.log('auth_token:', localStorage.getItem('auth_token'));

// Test API client
import('./lib/api.js').then(({ apiClient }) => {
  console.log('API client has token:', apiClient.hasToken());
});