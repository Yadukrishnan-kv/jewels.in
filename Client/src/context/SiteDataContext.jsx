import { createContext, useContext, useEffect, useState } from "react";
import { api, imageUrl } from "../api/client.js";
import { applyThemeColors } from "../utils/theme.js";
import { setCurrencySymbol } from "../utils/currency.js";

const SiteDataContext = createContext(null);

const FALLBACK_SETTINGS = {
  siteName: "Store",
  tagline: "DO CONNECT GET ACCESSORISED",
  offerBarText: "DO CONNECT GET ACCESSORISED",
  offerBarEnabled: true,
  whatsappNumber: "910000000000",
  contactPhone: "",
  contactEmail: "",
  address: "",
  socialLinks: {},
  themeColors: {},
  currencySymbol: "₹",
  metaDescription: "",
  sectionTitles: {},
};

function applySiteChrome(settings) {
  if (settings.siteName) document.title = settings.siteName;

  if (settings.favicon) {
    let iconLink = document.querySelector("link[rel~='icon']");
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      document.head.appendChild(iconLink);
    }
    iconLink.href = imageUrl(settings.favicon);
  }

  if (settings.metaDescription) {
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = settings.metaDescription;
  }
}

export function SiteDataProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([api.get("/categories"), api.get("/settings")])
      .then(([cats, settingsRes]) => {
        setCategories(cats || []);
        if (settingsRes) {
          setSettings(settingsRes);
          applyThemeColors(settingsRes.themeColors);
          setCurrencySymbol(settingsRes.currencySymbol);
          applySiteChrome(settingsRes);
        }
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
