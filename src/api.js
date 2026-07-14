const API_URL = process.env.REACT_APP_API_URL;

export function apiFetch(url, options = {}) {

  const token = localStorage.getItem("token");

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

}