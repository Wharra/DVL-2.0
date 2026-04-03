import { apiRequest } from './api.js'

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export function resendVerificationEmail(payload) {
  return apiRequest('/auth/resend-verification-email', {
    method: 'POST',
    body: payload,
  })
}

export function loginUser(credentials) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: credentials,
  })
}

export function fetchSession() {
  return apiRequest('/auth/session')
}

export function logoutUser() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  })
}

export function verifyEmailToken(token) {
  const query = new URLSearchParams({ token }).toString()
  return apiRequest(`/users/verify-email?${query}`)
}
