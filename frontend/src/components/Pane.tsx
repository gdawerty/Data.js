import React from "react";
import { Card } from "react-bootstrap";

interface PaneProps {
  title: string;
  children: React.ReactNode;
  width?: number;
  isDarkMode: boolean;
}

const Pane: React.FC<PaneProps> = ({ title, children, width, isDarkMode }) => {
  // Define light and dark theme styles
  const lightThemeStyles = {
    card: {
      backgroundColor: "#ffffff", // White background
      color: "#000000", // Black text
    },
    header: {
      backgroundColor: "#f8f9fa", // Light gray header
      color: "#000000", // Black text
    },
  };

  const darkThemeStyles = {
    card: {
      backgroundColor: "#343a40", // Dark gray background
      color: "#ffffff", // White text
    },
    header: {
      backgroundColor: "#212529", // Darker gray header
      color: "#ffffff", // White text
    },
  };

  // Use dark or light styles based on isDarkMode
  const styles = isDarkMode ? darkThemeStyles : lightThemeStyles;

  return (
    <Card
      style={{
        width: width || 400,
        height: 400,
        backgroundColor: styles.card.backgroundColor,
        color: styles.card.color,
        marginBottom: "1rem",
      }}
    >
      <Card.Header style={styles.header}>{title}</Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  );
};

export default Pane;
