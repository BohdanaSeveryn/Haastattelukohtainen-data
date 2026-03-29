import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { translations } from "../i18n/translations";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();

  return (
    <button onClick={toggleTheme}>
      {theme === "light"
        ? translations[language].darkTheme
        : translations[language].lightTheme}
    </button>
  );
}
