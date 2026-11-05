const BASE = '/api'

function getHeaders(multipart = false) {
  const token = localStorage.getItem('token')
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (!multipart) headers['Content-Type'] = 'application/json'
  return headers
}

export async function signup(data) {
  const res = await fetch(`${BASE}/auth/signup`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function login(data) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(data)
  })
  return res.json()
}

export async function getPublicNotes() {
  const res = await fetch(`${BASE}/notes/public`)
  return res.json()
}

export async function getMyNotes() {
  const res = await fetch(`${BASE}/notes/my`, { headers: getHeaders() })
  return res.json()
}

export async function getNoteById(id) {
  const res = await fetch(`${BASE}/notes/${id}`, { headers: getHeaders() })
  return res.json()
}

export async function uploadNote(formData) {
  const res = await fetch(`${BASE}/notes/upload`, {
    method: 'POST',
    headers: getHeaders(true),
    body: formData
  })
  return res.json()
}

export async function deleteNote(id) {
  const res = await fetch(`${BASE}/notes/${id}`, {
    method: 'DELETE', headers: getHeaders()
  })
  return res.json()
}

export function getDownloadUrl(id) {
  return `${BASE}/notes/download/${id}`
}
