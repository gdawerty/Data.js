import React from "react";
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryStack, VictoryTooltip, VictoryLegend} from "victory";
import Pane from "../Pane";

interface BarChartProps {
  title: string;
  xLabel: string;
  yLabel: string;
  isDarkMode: boolean;
}

const BarChart: React.FC<BarChartProps> = ({ title, isDarkMode }) => {
  const data = [
    {
      Month: "January",
      investment_account: 15000,
      account_401k: 10000,
      IRA: 5000,
      savings: 3000,
      checking: 2000,
    },
    {
      Month: "February",
      investment_account: 16000,
      account_401k: 11000,
      IRA: 5500,
      savings: 3500,
      checking: 2500,
    },
    {
      Month: "March",
      investment_account: 16000,
      account_401k: 12000,
      IRA: 5500,
      savings: 3500,
      checking: 4000,
    },
    {
      Month: "April",
      investment_account: 14000,
      account_401k: 13000,
      IRA: 5500,
      savings: 3000,
      checking: 2000,
    },
    {
      Month: "May",
      investment_account: 15000,
      account_401k: 14000,
      IRA: 5500,
      savings: 3500,
      checking: 2500,
    },
  ];

  // Define colors for each bar stack
  const colors = {
    investment_account: "#8884d8",
    account_401k: "#82ca9d",
    IRA: "#ffc658",
    savings: "#ff7300",
    checking: "#a4de6c",
  };

  const width=600;
  const height=400;

  return (
    <Pane title={title} width={width} isDarkMode={isDarkMode}>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={40} // Add padding between bars
        width={width - 50}
        height={height - 50}
        padding={{ top: 50, left: 70, right: 50, bottom: 75 }}
      >
        <VictoryAxis
          tickValues={data.map((d) => d.Month)}
          style={{
            tickLabels: { fill: isDarkMode ? "white" : "black" }, // Dynamic tick label color
          }}
        />
        <VictoryAxis
          dependentAxis
          tickFormat={(x) => `$${x / 1000}k`}
          style={{
            tickLabels: { fill: isDarkMode ? "white" : "black" }, // Dynamic tick label color
          }}
        />
        <VictoryLegend
          x={width / 2 - 250}
          y={25}
          orientation="horizontal"
          gutter={20}
          style={{
            labels: { fill: isDarkMode ? "white" : "black" }, // Dynamic legend label color
          }}
          data={[
            { name: "Investment Account" },
            { name: "401k Account" },
            { name: "IRA" },
            { name: "Savings" },
            { name: "Checking" },
          ]}
        />
        <VictoryStack>
          {/* Investment Account */}
          <VictoryBar
            data={data}
            x="Month"
            y="investment_account"
            labels={({ datum }) => `Investment: $${datum.investment_account}`}
            labelComponent={<VictoryTooltip />}
            style={{
              data: { fill: colors.investment_account },
            }}
          />
          {/* 401k Account */}
          <VictoryBar
            data={data}
            x="Month"
            y="account_401k"
            labels={({ datum }) => `401k: $${datum.account_401k}`}
            labelComponent={<VictoryTooltip />}
            style={{
              data: { fill: colors.account_401k },
            }}
          />
          {/* IRA */}
          <VictoryBar
            data={data}
            x="Month"
            y="IRA"
            labels={({ datum }) => `IRA: $${datum.IRA}`}
            labelComponent={<VictoryTooltip />}
            style={{
              data: { fill: colors.IRA },
            }}
          />
          {/* Savings */}
          <VictoryBar
            data={data}
            x="Month"
            y="savings"
            labels={({ datum }) => `Savings: $${datum.savings}`}
            labelComponent={<VictoryTooltip />}
            style={{
              data: { fill: colors.savings },
            }}
          />
          {/* Checking */}
          <VictoryBar
            data={data}
            x="Month"
            y="checking"
            labels={({ datum }) => `Checking: $${datum.checking}`}
            labelComponent={<VictoryTooltip />}
            style={{
              data: { fill: colors.checking },
            }}
          />
        </VictoryStack>
      </VictoryChart>
    </Pane>
  );
};

export default BarChart;
