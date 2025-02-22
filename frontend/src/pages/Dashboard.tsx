import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import LineChart from "../components/panes/LineChart";
import BarChart from "../components/panes/BarChart";
import PieChart from "../components/panes/PieChart";
import Insight from "../components/panes/Insight";
import RecentTransactions from "../components/panes/RecentTransactions";
interface DashboardProps {
  isDarkMode: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  return (
    <Container className={isDarkMode ? "text-white" : "text-dark"} fluid>
      <h1 className="my-4">Dashboard</h1>
      <Row>
        <Col
        >
          <Insight isDarkMode={isDarkMode} />
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
          <BarChart title="Yearly Spending" xLabel="Month" yLabel="Investments" isDarkMode={isDarkMode} />
        </Col>
        <Col>
          <PieChart title="Expense Categories" isDarkMode={isDarkMode} />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
