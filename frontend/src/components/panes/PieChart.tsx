import React, {useEffect} from "react";
import { VictoryPie, VictoryTheme, VictoryTooltip } from "victory";
import Pane from "../Pane";
import Transaction from "../../types/Transaction";

interface PieChartProps {
  title: string;
  isDarkMode: boolean;
  categories: string[]; // Corrected spelling from "catagories" to "categories"
  transactions: Transaction[];
}

const PieChart: React.FC<PieChartProps> = ({ title, isDarkMode, categories, transactions }) => {
  // Helper function to check if a date is within the last 30 days
  const isWithinLast30Days = (date: string) => {
    const transactionDate = new Date(date);
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 90));
    return transactionDate >= thirtyDaysAgo;
  };

  // Filter transactions:
  // 1. Only include transactions from the last 30 days
  // 2. Only include transactions whose category matches one of the provided categories
  const filteredTransactions = transactions.filter(
    (transaction) =>
      isWithinLast30Days(transaction.date) && categories.includes(transaction.category)
  );

  // Calculate the total amount spent for each category
  const categoryTotals = filteredTransactions.reduce((acc, transaction) => {
    const { category, amount } = transaction;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(amount);
    return acc;
  }, {} as Record<string, number>);

  // Format the data for VictoryPie
  const data = Object.entries(categoryTotals).map(([category, total]) => ({
    x: category,
    y: total,
  }));
  
  useEffect(() => {
    console.log(title, data);
  }, [data]);

  // Calculate the total for percentage calculation
  const total = data.reduce((sum, { y }) => sum + y, 0);

  return (
    <Pane title={title} isDarkMode={isDarkMode} width={400}>
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
        labels={({ datum }) => `${datum.x}: $${datum.y.toFixed(2)} (${((datum.y / total) * 100).toFixed(2)}%)`}
        innerRadius={50}
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
