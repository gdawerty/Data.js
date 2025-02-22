import React from "react";
import { Navbar, Nav, Form, Button } from "react-bootstrap";
import { Nightlight, LightMode } from "@mui/icons-material";
interface NavbarProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const CustomNavbar: React.FC<NavbarProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <Navbar
      bg={isDarkMode ? "dark" : "light"}
      variant={isDarkMode ? "dark gray" : "light"}
      className="shadow-sm"
      expand="lg"
    >
      <Navbar.Brand style={{ paddingLeft: "20px" }} href="#">
        My App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#">Home</Nav.Link>
          <Nav.Link href="#">About</Nav.Link>
        </Nav>
        <Form style={{ paddingRight: "20px" }}>
          <Button className={isDarkMode ? "btn btn-dark" : "btn btn-light"} onClick={toggleTheme}>
            {isDarkMode ? <Nightlight /> : <LightMode />}
          </Button>
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
