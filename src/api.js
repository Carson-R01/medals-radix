// Use proxy in local dev, fixed Azure URL in production builds
const API_BASE =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "" // Vite dev proxy
    : "https://medalapi-bbesdff7ftbsc3gk.northcentralus-01.azurewebsites.net";

// API route is fixed; no env or discovery needed
const COUNTRIES_PATH = "/api/country";

const buildUrl = (suffix = "") =>
  `${API_BASE.replace(/\/$/, "")}${COUNTRIES_PATH}${
    suffix ? `/${suffix}` : ""
  }`;

async function handleResponse(response) {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `API error (${response.status}): ${message || response.statusText}`
    );
  }
  // Some delete endpoints return no content
  if (response.status === 204) return null;
  return response.json();
}

export async function fetchCountries() {
  const res = await fetch(buildUrl());
  return handleResponse(res);
}

export async function createCountry(name) {
  const res = await fetch(buildUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      gold: 0,
      silver: 0,
      bronze: 0,
    }),
  });
  return handleResponse(res);
}

export async function deleteCountry(id) {
  const res = await fetch(buildUrl(id), { method: "DELETE" });
  return handleResponse(res);
}
