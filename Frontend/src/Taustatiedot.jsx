import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { translations } from "./i18n/translations"; 
import { useLanguage } from "./context/LanguageContext";
import ThemeSwitcher from "./components/ThemeSwitcher";

export default function Taustatiedot() {
    const { language } = useLanguage();
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const mode = params.get("mode");
    const tutkinto = params.get("tutkinto");
    const vuosi = params.get("vuosi");
    const theme = params.get("theme");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5180/api/haastattelut/background?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}`)
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
            <h3>{translations[language].background}</h3>

            <br />
            <p>{translations[language].degree}: {data.tutkinto}</p>
            <p>{translations[language].year}: {vuosi}</p>
            <br />
            <h3>{translations[language].educationBackground}</h3>
            <p>{translations[language].vocational}: {data.percentAmmatillinen.toFixed(1)}%</p>
            <p>{translations[language].highSchool}: {data.percentLukio.toFixed(1)}%</p>
            <p>{translations[language].university}: {data.percentKorkeakoulu.toFixed(1)}%</p>
            <h3>{translations[language].workExperience}</h3>
            <p>{translations[language].average}: {data.avgTyokokemus.toFixed(1)} {translations[language].years}</p>
            <p>{translations[language].median}: {data.median.toFixed(1)} {translations[language].years}</p>

            <br /><br />
            <button onClick={() => navigate(`/mode?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&theme=${theme}`)}>
                {translations[language].back}
            </button>
        </div>
    );
}
