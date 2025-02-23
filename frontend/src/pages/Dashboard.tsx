import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import LineChart from "../components/panes/LineChart";
import BarChart from "../components/panes/BarChart";
import PieChart from "../components/panes/PieChart";
import InsightPane from "../components/panes/InsightPane";
import RecentTransactions from "../components/panes/RecentTransactions";
import Insight from "../types/Insight";
import { TrendingUp } from "@mui/icons-material";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from "victory";
interface DashboardProps {
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
    const data = [
      { x: "Salary Increase", y: 2 },
      { x: "Inflation Rate", y: 3.2 },
    ];

    const insight: Insight = {
      chart: (<VictoryChart
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
          </VictoryChart>),
      icon: (<TrendingUp sx={{ fontSize: 50 }} style={{ paddingBottom: "8px" }} />),
      title: "Salary Inflation",
      description: (
        <p>
          Your salary has only increased by <strong>2%</strong> over the past year, which is below the average inflation
          rate of <strong>3.2%</strong>. You may want to consider negotiating a raise or looking for a new job to keep
          up with rising costs.
        </p>
      ),
    };
  return (
    <Container className={isDarkMode ? "text-white" : "text-dark"} fluid>
      <h1 className="my-4">Dashboard</h1>
      <Row>
        <Col>
          <InsightPane isDarkMode={isDarkMode} insight={insight} />
        </Col>
        <Col>
          <RecentTransactions isDarkMode={isDarkMode} title="Recent Transactions" />
        </Col>
      </Row>
      <Row>
        <Col>
          <LineChart title="Monthly Income" xLabel="Month" yLabel="Income" isDarkMode={isDarkMode} />
        </Col>
        <Col>
          <BarChart title="Investments" xLabel="Month" yLabel="Investments" isDarkMode={isDarkMode} />
        </Col>
        <Col>
          <PieChart title="Expense Categories" isDarkMode={isDarkMode} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
