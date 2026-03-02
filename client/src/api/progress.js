/** @fileoverview API service for progress, achievements, and flashcards */

const getHeaders = () => {
  const token = localStorage.getItem('vanta_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const getProgress = async () => {
  const res = await fetch('/api/progress', { headers: getHeaders() });
  return handleResponse(res);
};

export const updateProgress = async (data) => {
  const res = await fetch('/api/progress', {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const addXP = async (action, amount) => {
  const res = await fetch('/api/progress/xp', {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ action, amount }),
  });
  return handleResponse(res);
};

export const getAchievements = async () => {
  const res = await fetch('/api/achievements', { headers: getHeaders() });
  return handleResponse(res);
};

export const checkAchievements = async () => {
  const res = await fetch('/api/achievements/check', {
    method: 'POST',
    headers: getHeaders(),
  });
  return handleResponse(res);
};

export const getFlashcards = async (techId) => {
  const url = techId ? `/api/learning/flashcards?techId=${techId}` : '/api/learning/flashcards';
  const res = await fetch(url, { headers: getHeaders() });
  return handleResponse(res);
};

export const updateFlashcardProgress = async (cardId, data) => {
  const res = await fetch(`/api/learning/flashcards/${cardId}/progress`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};
