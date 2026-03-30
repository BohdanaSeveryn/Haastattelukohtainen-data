import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { translations } from "./i18n/translations"; 
import { useLanguage } from "./context/LanguageContext";

export default function StartPage() {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const param = new URLSearchParams(window.location.search);
    const cameBack = sessionStorage.getItem("cameBack") === "true";

    const initialVuosi = param.get("vuosi") || "2026";
    const [vuosi, setVuosi] = useState(initialVuosi);

    const initialTutkinto = cameBack ? param.get("tutkinto") : "";
    const [tutkinto, setTutkinto] = useState(initialTutkinto);

    if (cameBack) {
    sessionStorage.removeItem("cameBack");
    }

    const canProceed = tutkinto !== "" && vuosi !== "";
    const [darkTheme, setDarkTheme] = useState(false);

    return (
        <div>

            <br />

            <h3>{translations[language].selectDegree}</h3>
            <br />

            <button onClick={() => setTutkinto("RACA")}>
                {translations[language].raca}
            </button>
            <br /><br />
            <button onClick={() => setTutkinto("LITO")}>
                {translations[language].lito}
            </button>
            <br /><br />
            <button onClick={() => setTutkinto("Molemmat")}>
                {translations[language].both}
            </button>

            <h3>{translations[language].selectYear}</h3>

            <select value={vuosi} onChange={(e) => setVuosi(e.target.value)}>
                <option value="">-- {translations[language].selectYear} --</option>
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
            </select>

            <br /><br />

            <button
                disabled={!canProceed}
                onClick={() =>
                    navigate({
                        pathname: "/mode",
                        search: `?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&darkTheme=${darkTheme}`
                    })
                }
            >
                {translations[language].next}
            </button>
        </div>
    );
}
