const defaultBase =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "" // use dev proxy
    : "https://medalapi-bbesdff7ftbsc3gk.northcentralus-01.azurewebsites.net";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL ?? defaultBase;

const configuredPath = import.meta?.env?.VITE_COUNTRIES_PATH;

const PATH_CANDIDATES = configuredPath
  ? [configuredPath]
  : [
      "/api/countries",
      "/api/Country",
      "/api/country",
      "/countries",
      "/Country",
      "/country",
    ];

let resolvedPath = null;

const buildUrl = (path, suffix = "") =>
  `${API_BASE.replace(/\/$/, "")}${path}${suffix ? `/${suffix}` : ""}`;

async function resolvePath() {
  if (resolvedPath) return resolvedPath;
  const base = API_BASE.replace(/\/$/, "");
  // try candidates until one responds < 400
  for (const candidate of PATH_CANDIDATES) {
    try {
      const res = await fetch(buildUrl(candidate), { method: "GET" });
      if (res.ok) {
        resolvedPath = candidate;
        return resolvedPath;
      }
    } catch (e) {
      // ignore and continue trying
    }
  }
  throw new Error(
    `Could not find a working countries endpoint under ${base}. ` +
      "Set VITE_COUNTRIES_PATH to the correct route (e.g. /api/Country)."
  );
}

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
  const path = await resolvePath();
  const res = await fetch(buildUrl(path));
  return handleResponse(res);
}

export async function createCountry(name) {
  const path = await resolvePath();
  const res = await fetch(buildUrl(path), {
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
  const path = await resolvePath();
  const res = await fetch(buildUrl(path, id), { method: "DELETE" });
  return handleResponse(res);
}
