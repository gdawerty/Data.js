import React, { useEffect, useState } from "react";
import Pane from "../Pane";
import { TrendingUp } from "@mui/icons-material";
interface InsightPaneProps {
  isDarkMode: boolean;
}

const InsightPane: React.FC<InsightPaneProps> = ({ isDarkMode }) => {
  const [spendingInsights, setSpendingInsight] = useState<string>("");

  useEffect(() => {
    const fetchSpendingInsight = async () => {
      try {
        const message = await fetch("http://localhost:8000/api/pattern_recognition", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!message.ok) {
          throw new Error("Failed to fetch spending insight");
        }
        const data = await message.json();
        setSpendingInsight(data.response); // Assuming the response has a 'message' field
      } catch (error) {
        console.error("Error fetching spending insight:", error);
      }
    };
    fetchSpendingInsight();
  }, []);

  // Word-by-word display effect
  useEffect(() => {
    if (spendingInsights) {
      const words = spendingInsights.split(" ");
      let index = 0;

      const interval = setInterval(() => {
        if (index < words.length) {
          // setDisplayedInsight((prev) => prev + (prev ? " " : "") + words[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 500); // Adjust the speed of word display here

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [spendingInsights]);
  return (
    <Pane title="Insights" width={1225} isDarkMode={isDarkMode}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {/* Bar Chart */}

        {/* Text Content */}
        <div style={{ flex: 1 }}>
          <h1>
            <TrendingUp sx={{ fontSize: 50 }} style={{ paddingBottom: "8px" }} />
            Spending Analysis
          </h1>
          <hr />
          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              backgroundColor: isDarkMode ? "#444" : "#fff",
              whiteSpace: "pre-wrap",
            }}
          >
            <p>
              {spendingInsights || "Loading spending insight..."} {}
            </p>
          </div>
        </div>
      </div>
    </Pane>
  );
};

export default InsightPane;
