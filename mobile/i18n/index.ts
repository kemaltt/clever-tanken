import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import de from "./de.json";
import en from "./en.json";
import tr from "./tr.json";

const resources = {
  de: { translation: de },
  en: { translation: en },
  tr: { translation: tr },
};

const LANGUAGE_KEY = "user-language";

const languageDetector: any = {
  type: "languageDetector",
  async: true,
  detect: async (callback: (lang: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        return callback(savedLanguage);
      }
      // Fallback to device locale, but prioritize our 3 supported languages
      const deviceLocale = Localization.getLocales()[0].languageCode;
      const supported = ["de", "en", "tr"];
      const fallback = supported.includes(deviceLocale || "")
        ? deviceLocale
        : "de";
      callback(fallback || "de");
    } catch (error) {
      console.log("Error detecting language:", error);
      callback("de");
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) {
      console.log("Error caching language:", error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "de",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
