import { useNavigate } from "react-router-dom";
export default function KeskimääräinenPeruskouluVuosi() {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);

    const mode = params.get("mode");
    const tutkinto = params.get("tutkinto");
    const vuosi = params.get("vuosi");
    const language = params.get("language");
    const theme = params.get("theme");

    return (
        <div>
            <h2>Keskimääräinen peruskouluVuosi</h2>
            <p>Mode: {mode}</p>
            <p>Tutkinto: {tutkinto}</p>
            <p>Vuosi: {vuosi}</p>
            <p>Language: {language}</p>
            <p>Theme: {theme}</p>

            <button onClick={() => navigate(`/mode?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&theme=${theme}`)}>
                Takaisin
            </button>
        </div>
    );
}
