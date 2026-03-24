import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ModePage() {
    const params = new URLSearchParams(window.location.search);
    const tutkinto = params.get("tutkinto");
    const vuosi = params.get("vuosi");
    const language = params.get("language");
    const darkTheme = params.get("darkTheme");

    const navigate = useNavigate();

    const [mode, setMode] = useState(null);
    const canProceed = mode !== null;

    return (
        <div>
            <h2>Valittu tutkinto: {tutkinto}</h2>
            <h3>Valittu vuosi: {vuosi}</h3>

            <button onClick={() => setMode("background")}>
                Taustatiedot
            </button>

            <button onClick={() => setMode("competencies")}>
                Tunnistettu osaaminen
            </button>

            <br /><br />

            <button
                onClick={() =>
                    navigate({
                        pathname: "/",
                        search: `?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&darkTheme=${darkTheme}`
                    })
                }
            >
                Takaisin
            </button>

            <button
                disabled={!canProceed}
                onClick={() => {
                    if (mode === "background") {
                        navigate(`/results/background?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&darkTheme=${darkTheme}`);
                    }

                    if (mode === "competencies") {
                        navigate(`/results/competencies?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&darkTheme=${darkTheme}`);
                    }
                }}
            >
                Seuraava
            </button>

        </div>
    );
}
