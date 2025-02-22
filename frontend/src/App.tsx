import React, { useState } from "react";
import CustomNavbar from "./components/NavBar";
import Sidebar from "./components/SideBar";
// import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import History from "./pages/History";
import Insights from "./pages/Insights";
import Planning from "./pages/Planning";

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode);
  };

  return (
    <div className={isDarkMode ? "bg-dark text-white" : "bg-light text-dark"}>
      <CustomNavbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="d-flex">
        <Sidebar isDarkMode={isDarkMode} />
        <main className="flex-grow-1 p-3" style={{ backgroundColor: isDarkMode ? "#1d222b" : "#eef1fb" }}>
          <Router>
            <Routes>
              <Route path="/" element={<Dashboard isDarkMode={isDarkMode} />} />
              <Route path="/dashboard" element={<Dashboard isDarkMode={isDarkMode} />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/history" element={<History />} />
              <Route path="/planning" element={<Planning />} />
            </Routes>
          </Router>
        </main>
      </div>
      {/* <Footer isDarkMode={isDarkMode} /> */}
    </div>
  );
};

export default App;
