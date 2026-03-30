import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { translations } from "./i18n/translations"; 
import { useLanguage } from "./context/LanguageContext";

export default function Osaamisraportti() {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const tutkinto = params.get("tutkinto");
    const vuosi = params.get("vuosi");
    const rawLang = params.get("kieli");

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
            <br />
            <p>{translations[language].degree}: {data.tutkinto}</p>
            <p>{translations[language].year}: {vuosi}</p>
            <br />
            <h3>{translations[language].recognizedSkills}</h3>
            <p>{translations[language].average}: {data.keskimTunnistettu.toFixed(1)}</p>
            <p>{translations[language].avgPartiallyRecognized}: {data.keskimJonkinVerran.toFixed(1)}</p>
            <p>{translations[language].avgNotRecognized}: {data.keskimEiTunnistettu.toFixed(1)}</p>

            <h3>{translations[language].mostCommonSkill}</h3>
            <p>
            {translations[language].skillId}: {data.yleisimmatOsatIds.join(", ")}
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
            {language  === "sv" && (
                <>Procent: {data.yleisimmatOsatProsentit[0].toFixed(1)}% var och en</>
            )}
            </p>

            <h3>{translations[language].basisForRecognition}</h3>
            <p>{translations[language].workExperience}: {data.prosenttiTyokokemus.toFixed(1)}%</p>
            <p>{translations[language].education}: {data.prosenttiKoulutus.toFixed(1)}%</p>
            <p>{translations[language].otherSkills}: {data.prosenttiMuu.toFixed(1)}%</p>


            <br /><br />
            <button onClick={() => navigate(`/mode?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&theme=${theme}`)}>
                {translations[language].back}
            </button>
        </div>
    );
}
