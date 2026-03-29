import ThemeSwitcher from "./ThemeSwitcher";
import { useLanguage } from "../context/LanguageContext";

export default function TopBar() {
  const { changeLanguage } = useLanguage();

  return (
    <div className="topbar">
      <ThemeSwitcher />

      <div className="lang-buttons">
        <button onClick={() => changeLanguage("fi")}>FI</button>
        <button onClick={() => changeLanguage("en")}>EN</button>
        <button onClick={() => changeLanguage("sv")}>SV</button>
      </div>
    </div>
  );
}
