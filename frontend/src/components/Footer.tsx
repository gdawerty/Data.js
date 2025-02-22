import React from "react";
import { Navbar } from "react-bootstrap";

interface FooterProps {
    isDarkMode: boolean;
};

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  return (
    <Navbar 
    bg={isDarkMode ? "dark" : "light"} variant={isDarkMode ? "dark" : "light"}
    style={{ maxHeight: "30px"}}>
    
      <Navbar.Text style={{paddingLeft: "10px"}}>
        © 2025 Jerry Wang, David Li, Aaron Luu, and Ahmed Alamin. Released under the MIT License.
        </Navbar.Text>
    </Navbar>
  );
};

export default Footer;
