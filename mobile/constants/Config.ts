// Production URL (Vercel)
const PROD_URL = "https://gunstiger-tanken.vercel.app/api";

// Local Development Settings
// WARN: Update API_IP if your computer's IP changes
const API_IP = "192.168.178.185";
const API_PORT = "4000";
const DEV_URL = `http://${API_IP}:${API_PORT}/api`;

// Automatically switch based on environment
// __DEV__ is a global variable in React Native: true in dev, false in prod builds
const API_BASE_URL = __DEV__ ? DEV_URL : PROD_URL;

export default {
  API_BASE_URL,
  API_IP,
  API_PORT,
};
