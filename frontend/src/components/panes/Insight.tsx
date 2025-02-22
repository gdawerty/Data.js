import React from "react";
import Pane from "../Pane";
import { Card } from "react-bootstrap";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";

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
              }}
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
          <h1>Salary Inflation</h1>
          <hr />
          <p>
            Your salary has only increased by <strong>2%</strong> over the past year, which is below the average
            inflation rate of <strong>3.2%</strong>. You may want to consider negotiating a raise or looking for a new
            job to keep up with rising costs.
          </p>
        </div>
      </div>
    </Pane>
  );
};

export default Insight;
