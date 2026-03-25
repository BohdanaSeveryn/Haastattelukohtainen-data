import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function Taustatiedot() {
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const mode = params.get("mode");
    const tutkinto = params.get("tutkinto");
    const vuosi = params.get("vuosi");
    const language = params.get("language");
    const theme = params.get("theme");

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5180/api/haastattelut/background?tutkinto=${tutkinto}&vuosi=${vuosi}`)
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
    }, [tutkinto, vuosi]);

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
            <h3>Koulutustausta</h3>
            <p>Ammatillinen: {data.percentAmmatillinen.toFixed(1)}%</p>
            <p>Lukio: {data.percentLukio.toFixed(1)}%</p>
            <p>Korkeakoulu: {data.percentKorkeakoulu.toFixed(1)}%</p>
            <h3>Työkokemus</h3>
            <p>Keskimääräinen: {data.avgTyokokemus.toFixed(1)} vuotta</p>
            <p>Mediaani: {data.median.toFixed(1)} vuotta</p>

            <br /><br />
            <button onClick={() => navigate(`/mode?tutkinto=${tutkinto}&vuosi=${vuosi}&language=${language}&theme=${theme}`)}>
                Takaisin
            </button>
        </div>
    );
}
