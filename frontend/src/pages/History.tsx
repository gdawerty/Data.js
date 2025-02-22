import React, { useState } from "react";
import { Accordion, Form, Button, Card, ListGroup, Badge, Modal } from "react-bootstrap";
import "./History.css";

interface Transaction {
  id: number;
  dateTime: string;
  amount: number;
  isExpense: boolean;
  type: string;
  description: string;
}

interface HistoryProps {
  isDarkMode: boolean;
}

const History: React.FC<HistoryProps> = ({ isDarkMode }) => {
  const [filters, setFilters] = useState<{
    isExpense: boolean | null;
    type: string | null;
    startDate: string | null;
    endDate: string | null;
  }>({
    isExpense: null,
    type: null,
    startDate: null,
    endDate: null,
  });

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    dateTime: new Date().toISOString(),
    amount: 0,
    isExpense: true,
    type: "food",
    description: "",
  });

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

  const handleShowModal = () => setShowModal(true);

  // Handle closing the modal
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add the new transaction to the list (for now, just log it)
    console.log("New Transaction:", newTransaction);
    handleCloseModal(); // Close the modal
  };

  // Get the earliest transaction date
  const earliestDate = new Date(Math.min(...transactions.map((t) => new Date(t.dateTime).getTime())));

  // Generate all months between the earliest date and now
  const getAllMonths = () => {
    const months = [];
    const currentDate = new Date();
    let date = new Date(earliestDate);

    while (date <= currentDate) {
      months.push(date.toLocaleString("default", { month: "long", year: "numeric" }));
      date.setMonth(date.getMonth() + 1);
    }

    return months.reverse(); // Sort months in descending order
  };

  const allMonths = getAllMonths();

  // Filter transactions based on filters
  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesExpense = filters.isExpense === null || transaction.isExpense === filters.isExpense;
      const matchesType = filters.type === null || transaction.type === filters.type;
      const matchesDate =
        (!filters.startDate || new Date(transaction.dateTime) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(transaction.dateTime) <= new Date(filters.endDate));
      return matchesExpense && matchesType && matchesDate;
    })
    .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()); // Sort transactions in descending order

  // Group transactions by month, week, and day
  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.dateTime);
    const month = date.toLocaleString("default", { month: "long", year: "numeric" });
    const week = `Week ${Math.ceil(date.getDate() / 7)}`;
    const day = date.toLocaleDateString();

    if (!acc[month]) acc[month] = {};
    if (!acc[month][week]) acc[month][week] = {};
    if (!acc[month][week][day]) acc[month][week][day] = [];

    acc[month][week][day].push(transaction);
    return acc;
  }, {} as Record<string, Record<string, Record<string, Transaction[]>>>);

  return (
    <div style={{ padding: "20px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h1>History</h1>
        <Button variant="primary" onClick={handleShowModal} className="mb-4">
          Add New Transaction
        </Button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
        <Modal.Header closeButton className={isDarkMode ? "bg-dark text-light" : ""}>
          <Modal.Title>Add New Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? "bg-dark text-light" : ""}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                required
                className={isDarkMode ? "bg-secondary text-light" : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                required
                className={isDarkMode ? "bg-secondary text-light" : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={newTransaction.type}
                onChange={handleInputChange}
                required
                className={isDarkMode ? "bg-secondary text-light" : ""}
              >
                <option value="food">Food</option>
                <option value="transportation">Transportation</option>
                <option value="salary">Salary</option>
                <option value="shopping">Shopping</option>
                <option value="gift">Gift</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="isExpense"
                value={newTransaction.isExpense ? "expense" : "income"}
                onChange={(e) =>
                  setNewTransaction((prev) => ({
                    ...prev,
                    isExpense: e.target.value === "expense",
                  }))
                }
                required
                className={isDarkMode ? "bg-secondary text-light" : ""}
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="dateTime"
                value={newTransaction.dateTime}
                onChange={handleInputChange}
                required
                className={isDarkMode ? "bg-secondary text-light" : ""}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Transaction
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className={isDarkMode ? "bg-dark text-light" : ""}>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Grey Overlay */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Grey overlay
            zIndex: 1040, // Ensure it's below the modal (Bootstrap modals have z-index 1050)
          }}
        />
      )}

      <Card className={`mb-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
        <Card.Body>
          <Form>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              {/* Filters Section */}
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2 mb-0">Type:</Form.Label>
                  <Form.Select
                    className={`form-control w-auto ${isDarkMode ? "bg-secondary text-light" : ""}`}
                    value={filters.type || ""}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value || null })}
                  >
                    <option value="">All</option>
                    <option value="gift">Gift</option>
                    <option value="food">Food</option>
                    <option value="transportation">Transportation</option>
                    <option value="salary">Salary</option>
                    <option value="shopping">Shopping</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2 mb-0">Category:</Form.Label>
                  <Form.Select
                    className={`form-control w-auto ${isDarkMode ? "bg-secondary text-light" : ""}`}
                    value={filters.isExpense === null ? "" : filters.isExpense ? "expense" : "income"}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        isExpense: e.target.value === "" ? null : e.target.value === "expense",
                      })
                    }
                  >
                    <option value="">All</option>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2 mb-0">Start Date:</Form.Label>
                  <Form.Control
                    className={`form-control w-auto ${isDarkMode ? "bg-secondary text-light" : ""}`}
                    type="date"
                    value={filters.startDate || ""}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value || null })}
                  />
                </Form.Group>

                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2 mb-0">End Date:</Form.Label>
                  <Form.Control
                    className={`form-control w-auto ${isDarkMode ? "bg-secondary text-light" : ""}`}
                    type="date"
                    value={filters.endDate || ""}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value || null })}
                  />
                </Form.Group>
              </div>

              {/* Clear Filters Button */}
              <Button
                variant={isDarkMode ? "outline-light" : "secondary"}
                onClick={() =>
                  setFilters({
                    isExpense: null,
                    type: null,
                    startDate: null,
                    endDate: null,
                  })
                }
              >
                Clear Filters
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Accordion flush defaultActiveKey={allMonths} alwaysOpen className={isDarkMode ? "bg-dark text-light" : ""}>
        {allMonths.map((month) => (
          <Accordion.Item
            key={month}
            eventKey={month}
            className={isDarkMode ? "bg-dark text-light border-secondary" : ""}
          >
            <Accordion.Header
              style={{
                color: isDarkMode ? "#fff" : "#000",
              }}
            >
              <span
                style={{
                  color: isDarkMode ? "#fff" : "#000",
                }}
              >
                {month}
              </span>
            </Accordion.Header>
            <Accordion.Body className={isDarkMode ? "bg-dark text-light" : ""}>
              {groupedTransactions[month] ? (
                Object.entries(groupedTransactions[month])
                  .sort(([weekA], [weekB]) => parseInt(weekB.split(" ")[1]) - parseInt(weekA.split(" ")[1])) // Sort weeks in descending order
                  .map(([week, days]) => (
                    <Accordion
                      key={week}
                      defaultActiveKey={week}
                      alwaysOpen
                      className={isDarkMode ? "bg-dark text-light" : ""}
                    >
                      <Accordion.Item
                        eventKey={week}
                        className={isDarkMode ? "bg-dark text-light border-secondary" : ""}
                      >
                        <Accordion.Header>
                          <span
                            style={{
                              color: isDarkMode ? "#fff" : "#000",
                            }}
                          >
                            {week}
                          </span>
                        </Accordion.Header>
                        <Accordion.Body className={isDarkMode ? "bg-dark text-light" : ""}>
                          {Object.entries(days)
                            .sort(([dayA], [dayB]) => new Date(dayB).getTime() - new Date(dayA).getTime()) // Sort days in descending order
                            .map(([day, transactions]) => (
                              <Accordion
                                key={day}
                                defaultActiveKey={day}
                                alwaysOpen
                                className={isDarkMode ? "bg-dark text-light" : ""}
                              >
                                <Accordion.Item
                                  eventKey={day}
                                  className={isDarkMode ? "bg-dark text-light border-secondary" : ""}
                                >
                                  <Accordion.Header>
                                    <span
                                      style={{
                                        color: isDarkMode ? "#fff" : "#000",
                                      }}
                                    >
                                      {day}
                                    </span>
                                  </Accordion.Header>
                                  <Accordion.Body className={isDarkMode ? "bg-dark text-light" : ""}>
                                    <ListGroup variant={isDarkMode ? "flush" : ""}>
                                      {transactions.map((transaction) => (
                                        <ListGroup.Item
                                          key={transaction.id}
                                          className={`d-flex justify-content-between align-items-center ${
                                            isDarkMode ? "list-group-item-dark" : ""
                                          }`}
                                        >
                                          <div>
                                            <strong>{transaction.description}</strong>
                                            <br />
                                            <small>{transaction.type}</small>
                                          </div>
                                          <Badge bg={transaction.isExpense ? "danger" : "success"}>
                                            {transaction.isExpense ? "-" : "+"}${transaction.amount.toFixed(2)}
                                          </Badge>
                                        </ListGroup.Item>
                                      ))}
                                    </ListGroup>
                                  </Accordion.Body>
                                </Accordion.Item>
                              </Accordion>
                            ))}
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  ))
              ) : (
                <p className={isDarkMode ? "text-light" : ""}>No transactions for this month.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default History;
