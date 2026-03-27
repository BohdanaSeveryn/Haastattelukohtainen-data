import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Osaamisraportti() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    //const mode = params.get("mode");
    const tutkinto = params.get("tutkinto");
    const vuosi = params.get("vuosi");
    const rawLang = params.get("language");

    const language = 
        rawLang === "Suomi" ? "fi" :
        rawLang === "Ruotsi" ? "sv" :
        rawLang === "Englanti" ? "en" :
        "fi";

    let theme = params.get("theme");
    if (!theme || theme === "null") theme = "darkTheme";

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    fetch(`http://localhost:5180/api/haastattelut/competencies?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}`)
            .then(res => {
                if (!res.ok) throw new Error("Server error");
                return res.json();
            })
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [tutkinto, vuosi, language]);

    if (loading) return <p>Ladataan...</p>;
    if (error) return <p>Virhe: {error}</p>;
    if (!data) return <p>Ei dataa</p>;

    return (
        <div>
            <p>Language: {language}</p>
            <p>Theme: {theme}</p>

            <br /><br />
            <h2>Taustatiedot</h2>
            
            <br />
            <p>Tutkinto: {data.tutkinto}</p>
            <p>Vuosi: {vuosi}</p>
            <br />
            <h3>Tunnistetut osaamiset</h3>
            <p>Keskimäärin tunnistettu: {data.keskimTunnistettu.toFixed(1)}</p>
            <p>Keskimäärin jonkin verran tunnistettu: {data.keskimJonkinVerran.toFixed(1)}</p>
            <p>Keskimäärin ei-tunnistettu: {data.keskimEiTunnistettu.toFixed(1)}</p>

            <h3>Yleisin osaaminen</h3>
            <br />
            <p>
            Osa ID: {data.yleisimmatOsatIds.join(", ")}
            </p>

            <p>
            {data.yleisimmatOsatNimet.map((nimi, i) => (
                <span key={i}>{nimi}<br/></span>
            ))}
            </p>

            <p>
            {language === "fi" && (
                <>Prosentti: {data.yleisimmatOsatProsentit[0].toFixed(1)}% kukin</>
            )}
            {language === "en" && (
                <>Percentage: {data.yleisimmatOsatProsentit[0].toFixed(1)}% each</>
            )}
            {language === "sv" && (
                <>Procent: {data.yleisimmatOsatProsentit[0].toFixed(1)}% var och en</>
            )}
            </p>

            <h3>Tunnistamisen peruste</h3>
            <p>Työkokemus: {data.prosenttiTyokokemus.toFixed(1)}%</p>
            <p>Koulutus: {data.prosenttiKoulutus.toFixed(1)}%</p>
            <p>Muu osaaminen: {data.prosenttiMuu.toFixed(1)}%</p>


            <br /><br />
            <button onClick={() => navigate(`/mode?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&theme=${theme}`)}>
                Takaisin
            </button>
        </div>
    );
}
