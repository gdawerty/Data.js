import React, { useEffect, useState } from "react";
import Insight from "../types/Insight";
import { TrendingUp } from "@mui/icons-material";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryTheme } from "victory";
interface InsightsGeneratorProps {
  insights: Insight[];
  isDarkMode: boolean;
}

interface Transaction {
  id: number;
  dateTime: string;
  amount: number;
  isExpense: boolean;
  type: string;
  description: string;
}

const InsightsGenerator:any = (
  { insights, isDarkMode}: InsightsGeneratorProps
  ) => {
  const transactions: Transaction[] = [
    {
      id: 1,
      dateTime: "2024-08-01T12:00:00Z",
      amount: 100,
      isExpense: false,
      type: "gift",
      description: "Payment from John Doe",
    },
    {
      id: 2,
      dateTime: "2024-08-01T14:00:00Z",
      amount: 50,
      isExpense: true,
      type: "food",
      description: "Lunch at McDonald's",
    },
    {
      id: 3,
      dateTime: "2024-08-01T18:00:00Z",
      amount: 200,
      isExpense: true,
      type: "transportation",
      description: "Uber ride",
    },
    {
      id: 4,
      dateTime: "2024-09-02T09:00:00Z",
      amount: 5000,
      isExpense: false,
      type: "salary",
      description: "Monthly salary",
    },
    {
      id: 5,
      dateTime: "2024-12-02T12:00:00Z",
      amount: 100,
      isExpense: true,
      type: "food",
      description: "Dinner at KFC",
    },
    {
      id: 6,
      dateTime: "2024-12-03T10:00:00Z",
      amount: 300,
      isExpense: true,
      type: "shopping",
      description: "Clothes shopping",
    },
    {
      id: 7,
      dateTime: "2024-12-03T15:00:00Z",
      amount: 150,
      isExpense: false,
      type: "gift",
      description: "Gift from Jane Doe",
    },
    {
      id: 8,
      dateTime: "2025-01-01T09:00:00Z",
      amount: 75,
      isExpense: true,
      type: "transportation",
      description: "Bus fare",
    },
  ];
  let newInsights: Insight[] = insights;

  const date = new Date();
  const yearAgo = new Date(date.setFullYear(date.getFullYear() - 5));
  const inflationData = fetch(
    `https://www.statbureau.org/calculate-inflation-rate-json?jsoncallback=jQuery11120078729553850716_1740275733818&country=united-states&start=${yearAgo.getFullYear()}%2F${yearAgo.getMonth()}%2F${yearAgo.getDate()}&end=${date.getFullYear()}%2F${date.getMonth()}%2F${date.getDate()}&amount=100&format=true&_=1740275733820`
    ).then(
      (response) => response.json()
    ).then(
      (data) => {
        console.log("DATA", typeof data);
        const incomeChange:number = .122;
        if ((data as number) > (incomeChange as number)) {
          const newInsight = {
            chart: (
              <VictoryChart
                theme={VictoryTheme.material}
                domainPadding={50} // Add padding between bars
                padding={{ top: 40, bottom: 50, left: 60, right: 20 }}
                style={{
                  parent: {
                    backgroundColor: isDarkMode ? "#333" : "#fff",
                  },
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
            ),
            icon: <TrendingUp sx={{ fontSize: 50 }} style={{ paddingBottom: "8px" }} />,
            title: "Salary Inflation",
            description: (
              <p>
                Your salary has only increased by <strong>2%</strong> over the past year, which is below the average
                inflation rate of <strong>3.2%</strong>. You may want to consider negotiating a raise or looking for
                a new job to keep up with rising costs.
              </p>
            ),
          };

          newInsights.push(newInsight);
          console.log("NEW INSIGHTS", newInsights);
        }
      }
  );
  // return newInsights with duplicate titles removed
  newInsights = newInsights.filter(
    (insight, index, self) =>
      index === self.findIndex((t) => t.title === insight.title)
  );
    return (
      newInsights.filter(
        (insight, index, self) =>
          index === self.findIndex((t) => t.title === insight.title)
      )
    );
}

export default InsightsGenerator;