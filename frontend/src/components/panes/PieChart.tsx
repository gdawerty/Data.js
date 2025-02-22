import React from "react";
import { VictoryPie, VictoryTheme, VictoryTooltip } from "victory";
import Pane from "../Pane";

interface PieChartProps {
  title: string;
  isDarkMode: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ title, isDarkMode }) => {
  const data = [
    { x: "Entertainment", y: 8 },
    { x: "Transportation", y: 4 },
    { x: "Groceries", y: 5 },
    { x: "Rent", y: 35 },
    { x: "Utilities", y: 27 },
  ];

  // Calculate the total for percentage calculation
  const total = data.reduce((sum, { y }) => sum + y, 0);

  return (
    <Pane title={title} isDarkMode={isDarkMode}>
      <VictoryPie
        data={data}
        theme={VictoryTheme.material}
        padding={40}
        style={{
          labels: {
            fill: isDarkMode ? "white" : "black", // Label text color
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
        labelComponent={
          <VictoryTooltip
            flyoutStyle={{
              fill: isDarkMode ? "#343a40" : "#ffffff", // Tooltip background color
              stroke: isDarkMode ? "#ffffff" : "#343a40", // Tooltip border color
            }}
            style={{
              fill: isDarkMode ? "#ffffff" : "#343a40", // Tooltip text color
              fontSize: 12,
            }}
            cornerRadius={5}
            pointerLength={10}
            flyoutPadding={{ top: 10, bottom: 10, left: 15, right: 15 }}
          />
        }
        labels={({ datum }) => `${datum.x}: ${((datum.y / total) * 100).toFixed(2)}%`}
        // Set background color dynamically
        innerRadius={50}
        padAngle={2}
        colorScale={
          isDarkMode
            ? ["#82ca9d", "#8884d8", "#ffc658", "#ff7300", "#a4de6c"]
            : ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c"]
        }
      />
    </Pane>
  );
};

export default PieChart;
