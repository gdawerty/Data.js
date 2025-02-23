import React, {useState, useEffect} from "react";
import { Container, Row, Col } from "react-bootstrap";
import LineChart from "../components/panes/LineChart";
import BarChart from "../components/panes/BarChart";
import PieChart from "../components/panes/PieChart";
import InsightPane from "../components/panes/InsightPane";
import RecentTransactions from "../components/panes/RecentTransactions";
import Transaction from "../types/Transaction";
interface DashboardProps {
  isDarkMode: boolean;
}


const Dashboard: React.FC<DashboardProps> = ({ isDarkMode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<string[]>([]);
  const [incomeCategories, setIncomeCategories] = useState<string[]>([]);
  // const [displayedInsight, setDisplayedInsight] = useState<string>("");

  // Fetch transactions from the API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("http://3.145.10.5:8000/api/get_transaction");
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
      } catch (error) {
        console.error("Error fetching spending insight:", error);
      }
    };

    fetchSpendingInsight();
    fetchTransactions();
  }, []);

  const sortedTransactions = transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentTransactions = sortedTransactions.slice(0, 4);
  return (
    <Container className={isDarkMode ? "text-white" : "text-dark"} fluid>
      <h1 className="my-4">Dashboard</h1>
      <Row>
        <Col>
          <InsightPane isDarkMode={isDarkMode} />
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
