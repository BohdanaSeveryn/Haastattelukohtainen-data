import{BrowserRouter, Route, Routes} from "react-router-dom";
import StartPage from "./StartPage";
import ModePage from "./ModePage";
import Taustatiedot from "./Taustatiedot";
import KeskimääräinenPeruskouluVuosi from "./KeskimääräinenPeruskouluVuosi";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/mode" element={<ModePage />} />
        <Route path="/results/background" element={<Taustatiedot />} />
        <Route path="/results/competencies" element={<KeskimääräinenPeruskouluVuosi />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App
