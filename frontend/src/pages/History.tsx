import React, { useState, useEffect } from "react";
import { Accordion, Form, Button, Card, ListGroup, Badge, Modal, Spinner } from "react-bootstrap";
import "./History.css";
import { Lightbulb } from "@mui/icons-material";
import Transaction from "../types/Transaction";

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
  const [showAIInsight, setShowAIInsight] = useState(false); // State for AI insight visibility
  const [AIInsightId, setAIInsightId] = useState<number | null>(null); // State for AI insight ID
  const [AIInsightLoading, setAIInsightLoading] = useState(false); // State for AI insight loading
  const [AIInsightResponse, setAIInsightResponse] = useState<string | null>(null); // State for AI insight response
  const [newTransaction, setNewTransaction] = useState<Partial<Transaction>>({
    date: new Date().toISOString(),
    amount: "0",
    is_expense: true,
    category: "food",
    description: "",
  });

  const [transactions, setTransactions] = useState<Transaction[]>([]); // State for transactions
  const [categories, setCategories] = useState<string[]>([]); // State for unique categories

  useEffect(() => {
    if (AIInsightId == null) {
      return;
    }
    const fetchAIInsight = async () => {
      try {
        setAIInsightLoading(true);
        const response = await fetch(`http://localhost:8000/api/transaction_insight`,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: AIInsightId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch AI insight");
        }
        const data = await response.json();
        setAIInsightResponse(data.response);
        setAIInsightLoading(false);
        console.log("AI Insight:", data);
      } catch (error) {
        console.error("Error fetching AI insight:", error);
      }
    }

    fetchAIInsight();
  }, [AIInsightId]);

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

        // Extract unique categories for the filter dropdown
        const uniqueCategories = Array.from(new Set(data.expenses.map((t: Transaction) => t.category)));
        setCategories(uniqueCategories as string[]);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const handleShowModal = () => setShowModal(true);

  // Handle closing the modal
  const handleCloseModal = () => setShowModal(false);

  const handleShowAIInsight = () => setShowAIInsight(true);
  const handleCloseAIInsight = () => {
    setShowAIInsight(false)
    setAIInsightId(null);
    setAIInsightResponse(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === "amount" ? value : value,
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
  const earliestDate = new Date(Math.min(...transactions.map((t) => new Date(t.date).getTime())));

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
      const matchesExpense = filters.isExpense === null || transaction.is_expense === filters.isExpense;
      const matchesType = filters.type === null || transaction.category === filters.type;
      const matchesDate =
        (!filters.startDate || new Date(transaction.date) >= new Date(filters.startDate)) &&
        (!filters.endDate || new Date(transaction.date) <= new Date(filters.endDate));
      return matchesExpense && matchesType && matchesDate;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort transactions in descending order

  // Group transactions by month, week, and day
  const groupedTransactions = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
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

      {/* Modal for adding a new transaction */}
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
                onChange={handleInputChange as any}
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
                onChange={handleInputChange as any}
                required
                className={isDarkMode ? "bg-secondary text-light" : ""}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={newTransaction.category}
                onChange={handleInputChange}
                required
                className={isDarkMode ? "bg-secondary text-light" : ""}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={newTransaction.date}
                onChange={handleInputChange as any}
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

      {/* SHOW AI INSIGHT */}
      <Modal show={showAIInsight} onHide={handleCloseAIInsight} centered size="lg">
        <Modal.Header closeButton className={isDarkMode ? "bg-dark text-light" : ""}>
          <Modal.Title>
            <Lightbulb 
            style={{
              marginRight: "10px",
              marginBottom: "6px"
            }}
            />
            View Transaction Insight
            </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? "bg-dark text-light" : ""}>
          {
            AIInsightLoading ? (
              <div className="text-center">
                <Spinner 
                animation="border" role="status" 
                style={{
                  width: "100px",
                  height: "100px",
                  padding: "20px"
                }}
                />
                <p>Loading AI insight...</p>
              </div>
            ) : AIInsightResponse ? (
              <p
                style={{
                  whiteSpace: "pre-wrap",
                }}
              >{AIInsightResponse}
              </p>
            ) : (
              <p>No AI insight available for this transaction.</p>
            )
          }
        </Modal.Body>
        <Modal.Footer className={isDarkMode ? "bg-dark text-light" : ""}>
          <Button variant="secondary" onClick={handleCloseAIInsight}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Grey Overlay */}
      {(showModal || showAIInsight) && (
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
      {/* Filters Section */}
      <Card className={`mb-4 ${isDarkMode ? "bg-dark text-light" : "bg-light text-dark"}`}>
        <Card.Body>
          <Form>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
              <div className="d-flex flex-wrap gap-3 align-items-center">
                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2 mb-0">Category:</Form.Label>
                  <Form.Select
                    className={`form-control w-auto ${isDarkMode ? "bg-secondary text-light" : ""}`}
                    value={filters.type || ""}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value || null })}
                  >
                    <option value="">All</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="d-flex align-items-center">
                  <Form.Label className="me-2 mb-0">Income/Expense:</Form.Label>
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

      {/* Transactions Accordion */}
      <Accordion flush alwaysOpen className={isDarkMode ? "bg-dark text-light" : ""}>
        {allMonths.map((month) => (
          <Accordion.Item
            key={month}
            eventKey={month}
            className={isDarkMode ? "bg-dark text-light border-secondary" : ""}
          >
            <Accordion.Header>{month}</Accordion.Header>
            <Accordion.Body className={isDarkMode ? "bg-dark text-light" : ""}>
              {groupedTransactions[month] ? (
                Object.entries(groupedTransactions[month])
                  .sort(([weekA], [weekB]) => parseInt(weekB.split(" ")[1]) - parseInt(weekA.split(" ")[1])) // Sort weeks in descending order
                  .map(([week, days]) => (
                    <Accordion key={week} alwaysOpen>
                      <Accordion.Item eventKey={week}>
                        <Accordion.Header>
                          {/* TODO: Week and dates of week */}
                          {week}
                        </Accordion.Header>
                        <Accordion.Body>
                          {Object.entries(days)
                            .sort(([dayA], [dayB]) => new Date(dayB).getTime() - new Date(dayA).getTime()) // Sort days in descending order
                            .map(([day, transactions]) => (
                              <Accordion key={day} alwaysOpen>
                                <Accordion.Item eventKey={day}>
                                  <Accordion.Header>{day}</Accordion.Header>
                                  <Accordion.Body>
                                    <ListGroup>
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
                                            <small>{transaction.category}</small>
                                          </div>
                                          <div className="transaction-actions">
                                            <Button
                                              variant="outline-primary"
                                              style={{
                                                marginRight: "10px",
                                              }}
                                              onClick={() => {
                                                setAIInsightId(transaction.id);
                                                handleShowAIInsight();
                                              }}
                                            >
                                              <Lightbulb />
                                            </Button>
                                            <Badge bg={transaction.is_expense ? "danger" : "success"}>
                                              {transaction.is_expense ? "-" : "+"}${transaction.amount}
                                            </Badge>
                                          </div>
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
