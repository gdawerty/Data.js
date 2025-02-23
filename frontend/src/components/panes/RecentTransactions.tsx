import React from "react";
import Pane from "../Pane";
import { Table, Badge } from "react-bootstrap";
import Transaction from "../../types/Transaction";

interface RecentTransactionsProps {
  isDarkMode: boolean;
  title: string;
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ isDarkMode, title, transactions }) => {

  const getRelativeTime = (date: string): string => {
    // Format: YYYY-MM-DD
    const currentDate = new Date();
    const transactionDate = new Date(date);
    const diff = currentDate.getTime() - transactionDate.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} days ago`;
    }
  }

  return (
    <Pane title={title} width={500} isDarkMode={isDarkMode}>
      <Table
        striped
        bordered
        hover
        variant={isDarkMode ? "dark" : "light"}
        style={{
          width: 450,
        }}
      >
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
              <td>{getRelativeTime(transaction.date)}</td>
              <td>
                <Badge bg={transaction.is_expense ? "danger" : "success"}>
                  {transaction.is_expense ? "-" : "+"}${transaction.amount as unknown as number}
                </Badge>
              </td>
              <td>{transaction.category}</td>
              <td>{transaction.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Pane>
  );
};

export default RecentTransactions;