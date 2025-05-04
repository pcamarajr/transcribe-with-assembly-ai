import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

/**
 * This component handles language changes based on URL parameters
 */
const LanguageRouteHandler: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();

  useEffect(() => {
    // If URL contains language parameter and it's different from current one
    if (
      lang &&
      i18n.language !== lang &&
      (lang === t("language.en") || lang === t("language.pt"))
    ) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n, t]);

  return <>{children}</>;
};

export default LanguageRouteHandler;
