Haastattelukohtainen Data – Full‑Stack Application

This project is a full‑stack system for analyzing interview‑based educational and competence data for RACA and LITO degree programs.
It consists of:
Backend (ASP.NET Core) — provides filtered interview data and computed statistics
Frontend (React) — displays analytical reports based on backend responses
The goal is to offer clear, data‑driven insights into applicants’ backgrounds and competence recognition.

🚀 Features Overview
🔹 Backend
Loads interview data from a local data service
Supports three degree filters:
RACA
LITO
MOLEMMAT (both)

Filters interviews by interview year

Computes:

Educational background percentages
Average and median work experience
Additional indicators (foreign studies, other skills)
Competence‑related statistics (in a separate endpoint)
Returns clean JSON responses for frontend consumption

🔹 Frontend
Built with React + React Router

Two main report pages:
Taustatiedot (Background Information)
Osaaminen (Competence Overview)

Reads query parameters from the URL
Fetches data from backend and renders structured reports

📂 Project Structure
Код
/Backend
  Controllers/
  Models/
  Services/
  Program.cs

/Frontend
  src/
    components/
    App.jsx
    main.jsx
🛠 Backend Setup

1. Install dependencies
dotnet restore

3. Run the backend
dotnet run
The API becomes available at:
http://localhost:5180

4. CORS Configuration
The backend allows requests from the React development server (http://localhost:5173) through a named CORS policy.

🔌 API Endpoints
📍 /api/haastattelut/background
Returns background statistics for a selected degree and interview year.

Query parameters:
tutkinto — RACA, LITO, or MOLEMMAT
vuosi — interview year (e.g., 2024, 2025, 2026)

The response includes:
Degree and year
Percentages of completed education levels
Average and median work experience
Indicators such as foreign studies and other skills

📍 /api/haastattelut/competencies
(Implemented similarly; used for the second report.)

Returns competence‑related statistics such as:
Average recognized competence units
Most common competence unit
Recognition method distribution

🖥 Frontend Setup
1. Install dependencies
npm install

3. Run the development server
npm run dev

The frontend runs at:
http://localhost:5173

🔗 Frontend–Backend Integration
The frontend retrieves data by reading URL parameters and sending requests to the backend.
Each report page fetches the corresponding endpoint and renders the returned statistics.

📊 Reports
1. Taustatiedot (Background Report)
Displays:
Educational background distribution
Average and median work experience
Additional background indicators

2. Osaaminen (Competence Report)
Displays:
Recognized competence units
Most common competence unit
Recognition method percentages

🧪 Development Notes
Data is currently loaded from a local service; no database is required
The architecture is designed for easy expansion
Additional endpoints or data sources can be added without major restructuring

📄 License
Internal and educational use.
