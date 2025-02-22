import React from "react";
import Pane from "../Pane";

interface InsightProps {
  isDarkMode: boolean;
}

const Insight: React.FC<InsightProps> = ({ isDarkMode }) => {
  return (
    <Pane title="Insights" width={1325} isDarkMode={isDarkMode}>
      Insights asdfasdf
    </Pane>
  );
};

export default Insight;