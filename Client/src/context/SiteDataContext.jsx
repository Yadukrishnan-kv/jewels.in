import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client.js";

const SiteDataContext = createContext(null);

const FALLBACK_SETTINGS = {
  siteName: "The Halla",
  tagline: "DO CONNECT GET ACCESSORISED",
  offerBarText: "DO CONNECT GET ACCESSORISED",
  offerBarEnabled: true,
  whatsappNumber: "910000000000",
  contactPhone: "",
  contactEmail: "",
  address: "",
  socialLinks: {},
};

export function SiteDataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/settings")])
      .then(([cats, settingsRes]) => {
        setCategories(cats || []);
        if (settingsRes) setSettings(settingsRes);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  return (
    <SiteDataContext.Provider value={{ categories, settings, loaded }}>{children}</SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const ctx = useContext(SiteDataContext);
  if (!ctx) throw new Error("useSiteData must be used within SiteDataProvider");
  return ctx;
}
