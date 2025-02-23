import React, { useState, useEffect } from "react";

const LoadingIndicator: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const [loadingText, setLoadingText] = useState("Loading.");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading.") return "Loading..";
        if (prev === "Loading..") return "Loading...";
        return "Loading.";
      });
    }, 500); // Change the text every 500ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return <div style={{ textAlign: "center", color: isDarkMode ? "#aaa" : "#666" }}>{loadingText}</div>;
};

export default LoadingIndicator;
