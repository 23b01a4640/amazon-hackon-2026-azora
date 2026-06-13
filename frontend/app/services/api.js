const API_BASE = "http://127.0.0.1:8000";

/**
 * POST /understand
 * Sends user query, returns { mission: "New Apartment" } or { mission: "Direct Product", search_query: "..." }
 */
export const understandGoal = async (goalText) => {
  const response = await fetch(`${API_BASE}/understand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: goalText }),
  });

  if (!response.ok) throw new Error("Failed to understand goal");
  return await response.json();
};

/**
 * POST /questions
 * Sends mission name, returns { questions: ["...", "..."] }
 */
export const getQuestions = async (mission) => {
  const response = await fetch(`${API_BASE}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mission }),
  });

  if (!response.ok) throw new Error("Failed to fetch questions");
  return await response.json();
};

/**
 * POST /adaptive-questions
 * Sends product query, returns { questions: ["...", "..."] }
 */
export const getAdaptiveQuestions = async (query) => {
  const response = await fetch(`${API_BASE}/adaptive-questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) throw new Error("Failed to fetch adaptive questions");
  return await response.json();
};

/**
 * GET /bundles/{mission_name}
 * Returns { mission, essentials: [...], best_value: [...], premium: [...] }
 */
export const getBundles = async (mission) => {
  const response = await fetch(`${API_BASE}/bundles/${encodeURIComponent(mission)}`);

  if (!response.ok) throw new Error("Failed to fetch bundles");
  return await response.json();
};

/**
 * GET /products/mission/{mission_name}
 * Returns all products for a mission
 */
export const getProductsByMission = async (mission) => {
  const response = await fetch(`${API_BASE}/products/mission/${encodeURIComponent(mission)}`);

  if (!response.ok) throw new Error("Failed to fetch products");
  return await response.json();
};

/**
 * GET /products/search?query=...
 * Returns matching products
 */
export const searchProducts = async (query) => {
  const response = await fetch(`${API_BASE}/products/search?query=${encodeURIComponent(query)}`);

  if (!response.ok) throw new Error("Failed to search products");
  return await response.json();
};
