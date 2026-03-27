import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function StartPage() {
    const navigate = useNavigate();

    const param = new URLSearchParams(window.location.search);
    const initialTutkinto = param.get("tutkinto");
    const initialVuosi = param.get("vuosi");

    const [darkTheme, setDarkTheme] = useState(false);
    const [language, setLanguage] = useState("fi");
    const [tutkinto, setTutkinto] = useState(initialTutkinto);
    const [vuosi, setVuosi] = useState(initialVuosi || "");

    const canProceed = tutkinto && vuosi;

    return (
        <div>
            <button onClick={() => setDarkTheme("Tumma")}>Tumma teema</button>
            <button onClick={() => setDarkTheme("Vaalea")}>Vaalea teema</button>

            <br /><br />

            <button onClick={() => setLanguage("Suomi")}>Suomi</button>
            <button onClick={() => setLanguage("Ruotsi")}>Ruotsi</button>
            <button onClick={() => setLanguage("Englanti")}>Englanti</button>

            <h2>Valitse tutkinto</h2>
            <br />

            <button onClick={() => setTutkinto("RACA")}>RACA</button>
            <button onClick={() => setTutkinto("LITO")}>LITO</button>
            <button onClick={() => setTutkinto("Molemmat")}>Molemmat</button>

            <h3>Valitse vuosi</h3>

            <select value={vuosi} onChange={(e) => setVuosi(e.target.value)}>
                <option value="">-- Valitse vuosi --</option>
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
                Seuraava
            </button>
        </div>
    );
}
