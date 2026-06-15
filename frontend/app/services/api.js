const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

if (typeof window !== "undefined") {
  console.log("[Azora] API_BASE:", API_BASE);
}

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.error("NEXT_PUBLIC_API_URL is not configured. API requests will fall back to localhost.");
}

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
export const getBundles = async (mission, userId = null) => {
  let url = `${API_BASE}/bundles/${encodeURIComponent(mission)}`;
  if (userId) {
    url += `?user_id=${encodeURIComponent(userId)}`;
  }
  const response = await fetch(url);

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

/**
 * POST /products/smart-search
 * Sends query + user answers + user_id, returns filtered & ranked products
 * Falls back to regular search if smart-search fails
 */
export const smartSearchProducts = async (query, answers = [], userId = null) => {
  try {
    const body = { query, answers };
    if (userId) body.user_id = userId;
    
    const response = await fetch(`${API_BASE}/products/smart-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Smart search failed");
    return await response.json();
  } catch (error) {
    // Fallback to regular search
    console.warn("Smart search unavailable, falling back to regular search:", error.message);
    const response = await fetch(`${API_BASE}/products/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error("Failed to search products");
    return await response.json();
  }
};

/**
 * POST /image-search
 * Sends an image file + optional text query, returns { mission, intent, detected_product, detected_category, detected_categories, products }
 */
export const imageSearch = async (imageFile, query = null) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  if (query && query.trim()) {
    formData.append("query", query.trim());
  }

  const response = await fetch(`${API_BASE}/image-search`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Image search failed");
  return await response.json();
};

/**
 * POST /memory/purchase
 * Save a product purchase to user history
 */
export const savePurchase = async (userId, product, mission = null) => {
  try {
    await fetch(`${API_BASE}/memory/purchase`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        product_name: product.name,
        category: product.category || null,
        brand: product.brand || product.seller || null,
        price: product.price || null,
        mission: mission,
      }),
    });
  } catch (err) {
    console.warn("Failed to save purchase:", err);
  }
};

/**
 * POST /memory/interaction
 * Save a product interaction (selected/removed/added)
 */
export const saveInteraction = async (userId, action, product, mission = null) => {
  try {
    await fetch(`${API_BASE}/memory/interaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        action,
        product_name: product.name,
        category: product.category || null,
        brand: product.brand || product.seller || null,
        mission: mission,
      }),
    });
  } catch (err) {
    console.warn("Failed to save interaction:", err);
  }
};
