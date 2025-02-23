import React from "react";
import Pane from "../Pane";
import { Card } from "react-bootstrap";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from "victory";
import Insight from "../../types/Insight";
interface InsightPaneProps {
  isDarkMode: boolean;
  insight: Insight;
}

const InsightPane: React.FC<InsightPaneProps> = ({ isDarkMode, insight }) => {
  return (
    <Pane title="Insights" width={1225} isDarkMode={isDarkMode}>
      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        {/* Bar Chart */}
        <Card
          style={{
            width: "300px",
            border: isDarkMode ? "2px solid #666" : "2px solid #ccc",
            margin: "1rem",
          }}
        >
          {insight.chart}
        </Card>

        {/* Text Content */}
        <div style={{ flex: 1 }}>
          <h1>
            {insight.icon}
            {insight.title}
          </h1>
          <hr />
          <p>
            {insight.description}
          </p>
        </div>
      </div>
    </Pane>
  );
};

export default InsightPane;
