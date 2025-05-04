import * as Flags from "country-flag-icons/react/3x2";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

export const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    // Update URL to reflect language change
    if (lang) {
      const path = window.location.pathname.replace(`/${lang}`, `/${language}`);
      navigate(path);
    }
  };

  // Determine which flag to show based on current language
  const CurrentFlag = i18n.language === "pt" ? Flags.BR : Flags.US;
  const currentLanguageName = i18n.language === "pt" ? "PT" : "EN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-1 px-2"
          aria-label="Change language"
        >
          <CurrentFlag className="h-4 w-6 mr-1" />
          <span>{currentLanguageName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => changeLanguage("en")}
          className="flex items-center"
        >
          <Flags.US className="h-4 w-6 mr-2" />
          {t("language.english")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => changeLanguage("pt")}
          className="flex items-center"
        >
          <Flags.BR className="h-4 w-6 mr-2" />
          {t("language.portuguese")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
