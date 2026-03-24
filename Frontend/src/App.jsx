import{BrowserRouter, Route, Routes} from "react-router-dom";
import StartPage from "./StartPage";
import ModePage from "./ModePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/mode" element={<ModePage />} />
        <Route path="/results" element={<div>Results Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
