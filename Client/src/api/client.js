const BASE = "/api";

async function request(path, { method = "GET", body, token, isForm = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
  put: (path, body) => request(path, { method: "PUT", body }),
  del: (path) => request(path, { method: "DELETE" }),
};

export const adminApi = {
  get: (path, token) => request(`/admin${path}`, { token }),
  post: (path, body, token) => request(`/admin${path}`, { method: "POST", body, token }),
  put: (path, body, token) => request(`/admin${path}`, { method: "PUT", body, token }),
  del: (path, token) => request(`/admin${path}`, { method: "DELETE", token }),
  upload: (file, token) => {
    const form = new FormData();
    form.append("image", file);
    return request("/admin/upload", { method: "POST", body: form, token, isForm: true });
  },
};

export function imageUrl(path) {
  if (!path) return "https://placehold.co/400x400/efede9/1a1a1a?text=No+Image";
  if (path.startsWith("http")) return path;
  return path;
}
