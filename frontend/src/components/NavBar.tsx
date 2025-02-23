import React from "react";
import { Navbar, Nav, Form, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { Nightlight, LightMode } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
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
      fixed="top"
    >
      <Navbar.Brand style={{ paddingLeft: "20px" }} href="/">
        FinSights
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
        <Form style={{ paddingRight: "10px" }}>
          <Button className={isDarkMode ? "btn btn-dark" : "btn btn-light"} onClick={toggleTheme}>
            {isDarkMode ? <Nightlight /> : <LightMode />}
          </Button>
        </Form>
        <Dropdown style={{ marginRight: "10px" }}>
          <Dropdown.Toggle variant={isDarkMode ? "outline-light" : "outline-dark"} id="dropdown-basic">
            <AccountCircle />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end">
            <Dropdown.Item href="#">Profile</Dropdown.Item>
            <Dropdown.Item href="#">Settings</Dropdown.Item>
            <Dropdown.Item href="#">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
