import{BrowserRouter, Route, Routes} from "react-router-dom";
import StartPage from "./StartPage";
import ModePage from "./ModePage";
import Taustatiedot from "./Taustatiedot";
import Osaamisraportti from "./Osaamisraportti";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import "./styles/theme.css";
import TopBar from "./components/TopBar";

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <TopBar />
            <Routes>
              <Route path="/" element={<StartPage />} />
              <Route path="/mode" element={<ModePage />} />
              <Route path="/results/background" element={<Taustatiedot />} />
              <Route path="/results/competencies" element={<Osaamisraportti />} />  
            </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>

  );
}

export default App
