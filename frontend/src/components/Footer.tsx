import React from "react";
import { Navbar } from "react-bootstrap";

interface FooterProps {
    isDarkMode: boolean;
};

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <Navbar fixed="bottom" bg={isDarkMode ? "dark" : "light"} variant={isDarkMode ? "dark" : "light"}>
      <Navbar.Text>© 2025 Jerry Wang, David Li, Aaron Luu, and Ahmed Alamin</Navbar.Text>
    </Navbar>
  );
};

export default Footer;
