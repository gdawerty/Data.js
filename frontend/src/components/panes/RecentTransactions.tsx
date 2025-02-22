import React from "react";
import Pane from "../Pane";
import { Table, Badge } from "react-bootstrap";

interface Transaction {
  id: number;
  dateTime: string;
  amount: number;
  isExpense: boolean;
  type: string;
  description: string;
}

interface RecentTransactionsProps {
  isDarkMode: boolean;
  title: string;
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ isDarkMode, title }) => {
  const transactions: Transaction[] = [
    {
      id: 1,
      dateTime: "2025-02-21T12:00:00Z",
      amount: 100,
      isExpense: true,
      type: "Food",
      description: "Groceries",
    },
    {
      id: 2,
      dateTime: "2025-02-20T12:00:00Z",
      amount: 50,
      isExpense: true,
      type: "Transport",
      description: "Bus fare",
    },
    {
      id: 3,
      dateTime: "2025-02-19T12:00:00Z",
      amount: 2000,
      isExpense: false,
      type: "Income",
      description: "Salary",
    },
  ];

  const getRelativeTime = (dateTime: string): string => {
    const date = new Date(dateTime);
    const now = new Date();

    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  }

  return (
    <Pane title={title} width={400} isDarkMode={isDarkMode}>
      <Table striped bordered hover variant={isDarkMode ? "dark" : "light"} style={{
        maxWidth: 400,
      }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{getRelativeTime(transaction.dateTime)}</td>
              <td>
                <Badge bg={transaction.isExpense ? "danger" : "success"}>
                  {transaction.isExpense ? "-" : "+"}${
                  transaction.amount.toFixed(2)
                  }
                </Badge>
              </td>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Pane>
  );
};

export default RecentTransactions;