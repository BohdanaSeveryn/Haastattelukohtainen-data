import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function ModePage() {
    const params = new URLSearchParams(window.location.search);
    const tutkinto = params.get("tutkinto");
    const vuosi = params.get("vuosi");

    const [mode, setMode] = useState(null);
    const canProceed = mode !== null;

    navigate(`/?tutkinto=${tutkinto}&year=${year}&language=${language}&theme=${theme}`);

    return (
        <div>
            <h2>Valittu tutkinto: {tutkinto}</h2>
            <h3>Valittu vuosi: {vuosi}</h3>
            <br />
            <button onClick={()=> setMode("background")}>
                Taustatiedot
            </button>
            <button onClick={()=> setMode("competencies")}>
                Tunnistettu osaaminen
            </button>
            <br /><br />
            <button onClick={() => goBack(tutkinto, vuosi)}>
                Takaisin
            </button>

            <button disabled={!canProceed} onClick={() => goNext(mode, tutkinto, vuosi)}>
                Seuraava
            </button>

        </div>
    );
}

function goBack(tutkinto, year) {
    window.location.href = `/?tutkinto=${tutkinto}&year=${year}`;
}

function goNext(mode, tutkinto, year) {
    window.location.href = `/results?mode=${mode}&tutkinto=${tutkinto}&year=${year}`;
}
