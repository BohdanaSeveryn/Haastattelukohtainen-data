import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { translations } from "./i18n/translations"; 
import { useLanguage } from "./context/LanguageContext";

export default function ModePage() {
    const { language } = useLanguage();
    const params = new URLSearchParams(window.location.search);
    const tutkinto = params.get("tutkinto");
    const vuosi = params.get("vuosi");
    const darkTheme = params.get("darkTheme");

    const navigate = useNavigate();

    const [mode, setMode] = useState(null);
    const canProceed = mode !== null;

    return (
        <div>
            <h3>{translations[language].selectedDegree}: {tutkinto}</h3>
            <br />
            <h3>{translations[language].selectedYear}: {vuosi}</h3>
            <br /><br />
            <button onClick={() => setMode("background")}>
                {translations[language].background}
            </button>

            <button style={{ marginLeft: "10px" }} onClick={() => setMode("competencies")}>
                {translations[language].recognizedSkills}
            </button>

            <br /><br /><br /><br />

            <button
            onClick={() => {
                sessionStorage.setItem("cameBack", "true");
                navigate({
                pathname: "/",
                search: `?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&darkTheme=${darkTheme}`
                });
            }}
            >
            {translations[language].back}
            </button>

            <button
                disabled={!canProceed}
                style={{
                    marginLeft: "10px"
                }}
                onClick={() => {
                    if (mode === "background") {
                        navigate(`/results/background?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&darkTheme=${darkTheme}`);
                    }

                    if (mode === "competencies") {
                        navigate(`/results/competencies?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&darkTheme=${darkTheme}`);
                    }
                }}
            >
                {translations[language].next}
            </button>
        </div>
    );
}
