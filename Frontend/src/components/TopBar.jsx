import ThemeSwitcher from "./ThemeSwitcher";
import { useLanguage } from "../context/LanguageContext";

export default function TopBar() {
const { language, changeLanguage } = useLanguage();

  return (
    <div className="topbar">
      <ThemeSwitcher />

      <div className="lang-buttons">
        <button 
          className={language === "fi" ? "active" : ""} 
          onClick={() => changeLanguage("fi")}
        >
          FI
        </button>

        <button 
          className={language === "en" ? "active" : ""} 
          onClick={() => changeLanguage("en")}
        >
          EN
        </button>

        <button 
          className={language === "sv" ? "active" : ""} 
          onClick={() => changeLanguage("sv")}
        >
          SV
        </button>
      </div>
    </div>
  );
}
