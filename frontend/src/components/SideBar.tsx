import React from "react";
import { Nav, Button } from "react-bootstrap";
// import { Dashboard, Chat, History, BarChart } from "@mui/icons-material";
import { Dashboard, Chat, History } from "@mui/icons-material";
interface SidebarProps {
  isDarkMode: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ isDarkMode }) => {
  return (
    <Nav
      className={isDarkMode ? "flex-column bg-dark text-white" : "flex-column bg-light text-dark"}
      style={{ height: "100vh" }}
    >
      <Nav.Link href="/dashboard" style={{marginTop: "60px"}}>
        <Button variant={isDarkMode ? "outline-light" : "outline-dark"}>
          <Dashboard />
        </Button>
      </Nav.Link>
      <Nav.Link href="/chat">
        <Button variant={isDarkMode ? "outline-light" : "outline-dark"}>
          <Chat />
        </Button>
      </Nav.Link>
      <Nav.Link href="/history">
        <Button variant={isDarkMode ? "outline-light" : "outline-dark"}>
          <History />
        </Button>
      </Nav.Link>
      {/* <Nav.Link href="/planning">
        <Button variant={isDarkMode ? "outline-light" : "outline-dark"}>
          <BarChart />
        </Button>
      </Nav.Link> */}
    </Nav>
  );
};

export default Sidebar;
