import React from "react";
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis, VictoryArea } from "victory";
import Pane from "../Pane";
import Transaction from "../../types/Transaction";

interface LineChartProps {
  title: string;
  xLabel: string;
  yLabel: string;
  isDarkMode: boolean;
  transactions: Transaction[];
  is_expense: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ title, xLabel, yLabel, isDarkMode, transactions, is_expense }) => {
  const width = 700;
  const height = 400;
  // const data = [
  //   { x: "January", y: 2010 },
  //   { x: "February", y: 2200 },
  //   { x: "March", y: 1900 },
  //   { x: "April", y: 2500 },
  //   { x: "May", y: 3000 },
  // ];

    const dateToMonth = (date: string) => {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      const [year, month] = date.split("-").map(Number);
      return `${monthNames[month - 1]} ${year}`;
    };
  const uniqueMonths = Array.from(new Set(transactions.map((t) => dateToMonth(t.date)))).slice(0, 5);

    const monthlyExpenses = uniqueMonths.map((month) => {
      const totalExpense = transactions
        .filter((t) => dateToMonth(t.date) === month && t.is_expense === is_expense)
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      return { x: month, y: totalExpense };
    });

  // Define light and dark theme colors
  const lightThemeColors = {
    axis: "#000000", // Black for axis
    label: "#000000", // Black for labels
    line: "#8884d8", // Purple for the line
    area: "#8884d8", // Purple for the area fill
  };

  const darkThemeColors = {
    axis: "#ffffff", // White for axis
    label: "#ffffff", // White for labels
    line: "#82ca9d", // Green for the line
    area: "#82ca9d", // Green for the area fill
  };


  // Use dark or light colors based on isDarkMode
  const colors = isDarkMode ? darkThemeColors : lightThemeColors;

  return (
    <Pane title={title} width={width} isDarkMode={isDarkMode}>
      <VictoryChart
        theme={VictoryTheme.material}
        width={width - 50}
        height={height - 50}
        padding={{ top: 50, left: 70, right: 50, bottom: 75 }}
      >
        <VictoryAxis
          invertAxis
          label={xLabel}
          style={{
            axis: { stroke: colors.axis }, // Axis color
            tickLabels: { fill: colors.axis }, // Tick label color
            axisLabel: {
              padding: 30,
              fontWeight: "bold",
              fill: colors.label, // Axis label color
            },
          }}
        />
        <VictoryAxis
          dependentAxis
          label={yLabel}
          domain={[0, Math.max(...monthlyExpenses.map((d) => d.y)) + 500]}
          style={{
            axis: { stroke: colors.axis }, // Axis color
            tickLabels: { fill: colors.axis }, // Tick label color
            axisLabel: {
              padding: 50,
              fontWeight: "bold",
              fill: colors.label, // Axis label color
            },
          }}
        />
        {/* Fill below the line */}
        <VictoryArea
          data={monthlyExpenses}
          style={{
            data: {
              fill: colors.area, // Color for the filled area
              fillOpacity: 0.3, // Adjust opacity for a lighter fill
            },
          }}
        />
        {/* Line chart */}
        <VictoryLine
          data={monthlyExpenses}
          style={{
            data: {
              stroke: colors.line, // Color for the line
              strokeWidth: 2, // Thickness of the line
            },
          }}
        />
      </VictoryChart>
    </Pane>
  );
};

export default LineChart;
