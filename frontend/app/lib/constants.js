export const COLORS = {
  background: "#0F172A",
  secondary: "#111827",
  card: "#1E293B",
  accentBlue: "#00A8E1",
  accentOrange: "#FF9900",
  white: "#FFFFFF",
};

export const GOALS = [
  "New Apartment",
  "Start Running",
  "College Starter",
  "Home Office",
  "Skincare",
];

export const LOADING_MESSAGES = [
  "Understanding your goal...",
  "Planning what is needed...",
  "Finding the best products...",
  "Building complete bundles...",
];

export const API_URLS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
  SEARCH: "/search",
  QUESTIONS: "/questions",
  BUNDLES: "/bundles",
  CHECKOUT: "/checkout",
};
