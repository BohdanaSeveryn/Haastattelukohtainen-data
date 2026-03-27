import{BrowserRouter, Route, Routes} from "react-router-dom";
import StartPage from "./StartPage";
import ModePage from "./ModePage";
import Taustatiedot from "./Taustatiedot";
import Osaamisraportti from "./Osaamisraportti";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/mode" element={<ModePage />} />
        <Route path="/results/background" element={<Taustatiedot />} />
        <Route path="/results/competencies" element={<Osaamisraportti />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App
