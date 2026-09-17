const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(${API_URL}, options);
  if (!res.ok) throw new Error('API request failed');
  return res.json();
}
