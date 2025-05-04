import enCommon from "@/locales/en/common.json";
import ptCommon from "@/locales/pt/common.json";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources: {
      en: {
        common: enCommon,
      },
      pt: {
        common: ptCommon,
      },
    },
    fallbackLng: "en",
    debug: import.meta.env.DEV,

    ns: ["common"],
    defaultNS: "common",

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    detection: {
      order: ["path", "navigator"],
      lookupFromPathIndex: 0,
      caches: ["localStorage"],
    },
  });

export default i18n;
