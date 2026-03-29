import { useLanguage } from "../context/LanguageContext";

export default function LanguageSelector() {
  const { language, changeLanguage } = useLanguage();

  return (
    <select value={language} onChange={(e) => changeLanguage(e.target.value)}>
      <option value="fi">Suomi</option>
      <option value="sv">Svenska</option>
      <option value="en">English</option>
    </select>
  );
}
