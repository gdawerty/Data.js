import React from "react";
import Pane from "../Pane";
import { Card } from "react-bootstrap";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import { TrendingUp } from "@mui/icons-material";
interface InsightProps {
  isDarkMode: boolean;
}

const Insight: React.FC<InsightProps> = ({ isDarkMode }) => {
  // Data for the bar chart
  const data = [
    { x: "Salary Increase", y: 2 },
    { x: "Inflation Rate", y: 3.2 },
  ];

  return (
    <Pane title="Insights" width={1325} isDarkMode={isDarkMode}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {/* Bar Chart */}
        <Card
          style={{
            width: "300px",
            border: isDarkMode ? "2px solid #666" : "2px solid #ccc",
            margin: "1rem",
          }}
        >
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={50} // Add padding between bars
            padding={{ top: 40, bottom: 50, left: 60, right: 20 }}
            style={{
              parent: {
                backgroundColor: isDarkMode ? "#333" : "#fff"
              }
            }}
            
          >
            <VictoryAxis
              style={{
                tickLabels: { fill: isDarkMode ? "white" : "black" }, // Dynamic tick label color
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(y) => `${y}%`} // Format y-axis ticks as percentages
              style={{
                tickLabels: { fill: isDarkMode ? "white" : "black" }, // Dynamic tick label color
                axisLabel: { padding: 40, fill: isDarkMode ? "white" : "black" },
              }}
              label={"Percentage"}
            />
            <VictoryBar
              data={data}
              style={{
                data: {
                  fill: ({ datum }) => (datum.x === "Salary Increase" ? "#82ca9d" : "#8884d8"), // Custom bar colors
                },
              }}
            />
          </VictoryChart>
        </Card>

        {/* Text Content */}
        <div style={{ flex: 1 }}>
          <h1>
            <TrendingUp sx={{ fontSize: 50 }} style={{ paddingBottom: "8px" }} />
            Salary Inflation
          </h1>
          <hr />
          <p>
            Your salary has only increased by <strong>2%</strong> over the past year, which is below the average
            inflation rate of <strong>3.2%</strong>. You may want to consider negotiating a raise or looking for a new
            job to keep up with rising costs.
          </p>
          <br />
          <p>
            <strong>Tip:</strong> Research salary ranges for your position and location to ensure you're being paid
            fairly.
          </p>
        </div>
      </div>
    </Pane>
  );
};

export default Insight;
