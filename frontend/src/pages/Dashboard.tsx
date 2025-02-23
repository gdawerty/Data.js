import React, {useState, useEffect} from "react";
import { Container, Row, Col } from "react-bootstrap";
import LineChart from "../components/panes/LineChart";
import BarChart from "../components/panes/BarChart";
import PieChart from "../components/panes/PieChart";
import InsightPane from "../components/panes/InsightPane";
import RecentTransactions from "../components/panes/RecentTransactions";
import Insight from "../types/Insight";
import { TrendingUp } from "@mui/icons-material";
import { VictoryChart, VictoryBar, VictoryAxis, VictoryTheme } from "victory";
import Transaction from "../types/Transaction";
interface DashboardProps {
  isDarkMode: boolean;
}


const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  const [spendingInsights, setSpendingInsight] = useState<string>("");
  const [displayedInsight, setDisplayedInsight] = useState<string>("");


  const data = [
    { x: "Salary Increase", y: 2 },
    { x: "Inflation Rate", y: 3.2 },
  ];

  // Fetch transactions from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/get_transaction");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data.expenses);

        // Populate unique expense and income categories
        const expenses = data.expenses.filter((transaction: Transaction) => transaction.is_expense);
        const incomes = data.expenses.filter((transaction: Transaction) => !transaction.is_expense);

        const uniqueExpenseCategories = Array.from(
          new Set(expenses.map((transaction: Transaction) => transaction.category))
        );
        const uniqueIncomeCategories = Array.from(
          new Set(incomes.map((transaction: Transaction) => transaction.category))
        );

        setExpenseCategories(uniqueExpenseCategories as string[]);
        setIncomeCategories(uniqueIncomeCategories as string[]);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    const fetchSpendingInsight = async () => {
      try {
        const message = await fetch("http://localhost:8000/api/pattern_recognition",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!message.ok) {
          throw new Error("Failed to fetch spending insight");
        }
        const data = await message.json();
        setSpendingInsight(data.response); // Assuming the response has a 'message' field
      } catch (error) {
        console.error("Error fetching spending insight:", error);
      }
    };

    fetchSpendingInsight();
    fetchTransactions();
  }, []);

  // Word-by-word display effect
  useEffect(() => {
    if (spendingInsights) {
      const words = spendingInsights.split(" ");
      let index = 0;

      const interval = setInterval(() => {
        if (index < words.length) {
          setDisplayedInsight((prev) => prev + (prev ? " " : "") + words[index]);
          index++;
        } else {
          clearInterval(interval);
        }
      }, 500); // Adjust the speed of word display here

      return () => clearInterval(interval); // Cleanup on unmount
    }
  }, [spendingInsights]);

  const sortedTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentTransactions = sortedTransactions.slice(0, 4);

  const insight: Insight = {
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
    title: "Spending Analysis",
    description: (
      <div style={{ 
        maxHeight: "250px", 
        overflowY: "auto", 
        padding: "10px", 
        border: "1px solid #ccc", 
        borderRadius: "5px", 
        backgroundColor: isDarkMode ? "#444" : "#fff", 
        whiteSpace: "pre-wrap"
      }}>
        <p>
        {spendingInsights || "Loading spending insight..."} {}
        </p>
      </div>
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
          <PieChart
            title="Income Categories"
            isDarkMode={isDarkMode}
            categories={incomeCategories as string[]}
            transactions={sortedTransactions}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <LineChart
            title="Monthly Income"
            xLabel="Month"
            yLabel="Income"
            isDarkMode={isDarkMode}
            transactions={sortedTransactions}
            is_expense={false}
          />
        </Col>
        <Col>
          <RecentTransactions isDarkMode={isDarkMode} title="Recent Transactions" transactions={recentTransactions} />
        </Col>
        <Col>
          <PieChart
            title="Expense Categories"
            isDarkMode={isDarkMode}
            categories={expenseCategories as string[]}
            transactions={sortedTransactions}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <LineChart
            title="Monthly Expenses"
            xLabel="Month"
            yLabel="Expenses"
            isDarkMode={isDarkMode}
            transactions={sortedTransactions}
            is_expense={true}
          />
        </Col>
        <Col><BarChart title="Investments" xLabel="Month" yLabel="Investments" isDarkMode={isDarkMode} /></Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
