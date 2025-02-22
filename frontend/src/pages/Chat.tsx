import React, { useState, useEffect, useRef } from "react";
import { InputGroup, Form, Button } from "react-bootstrap";
import "./Chat.css";
interface ChatProps 
{
  isDarkMode: boolean;
}

const Chat: React.FC<ChatProps> = ({ isDarkMode }) => {
  const [inputValue, setInputValue] = useState<string>(""); // User input
  const [messages, setMessages] = useState<Array<{ text: string; sender: "user" | "bot" }>>([]); // Chat history
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [isChatStarted, setIsChatStarted] = useState<boolean>(false); // Track if the chat has started

  // Ref for the chat container
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to the bottom when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (message?: string) => {
    const userMessage = message || inputValue;
    if (!userMessage.trim()) return; // Ignore empty messages

    // Add the user's message to the chat history
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setInputValue(""); // Clear the input field
    setIsLoading(true); // Show loading state
    setIsChatStarted(true); // Expand the chat UI

    try {
      // Simulate a fetch request to an API
      const response:any = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            json: async () => ({ response: "This is a response from the bot" }),
          });
        }, 1000);
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      // Add the bot's response to the chat history
      setMessages((prev) => [...prev, { text: data.response, sender: "bot" }]);
    } catch (error) {
      console.error("Error:", error);
      // Add an error message to the chat history
      setMessages((prev) => [...prev, { text: "Failed to fetch response. Please try again.", sender: "bot" }]);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  const getBotResponseColor = (message: any) => {
    let color = "red";
    if (message.text === "Failed to fetch response. Please try again.") {
      color = "red";
    } else if (message.sender === "user") {
      // color = "#007bff";
      color = isDarkMode ? "#1d222b" : "#007bff";
    } else {
      color = "#e9ecef";
    }
    return color;
  };

  // Example prompts
  const examplePrompts = [
    "How am I doing on my saving goal?",
    "What are my top expenses this month?",
    "Where can I save more money?",
  ];

  return (
    <div
      style={{
        maxWidth: isChatStarted ? "1000px" : "600px",
        margin: "0 auto",
        padding: "20px",
        height: isChatStarted ? "100%" : "auto",
        transition: "height 0.3s ease",
      }}
    >
      <h1>Chat</h1>
      <div
        ref={chatContainerRef} // Attach the ref to the chat container
        style={{
          height: isChatStarted ? "500px" : "300px",
          width: isChatStarted ? "1000px" : "auto",
          // border: "1px solid #ccc",
          border: isDarkMode ? "1px solid #666" : "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          overflowY: "auto",
          marginBottom: "10px",
          backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
          display: "flex",
          flexDirection: "column",
          justifyContent: isChatStarted ? "flex-start" : "center",
          alignItems: "center",
          transition: "height 0.3s ease, justify-content 0.3s ease",
        }}
      >
        {!isChatStarted ? (
          <div>
            <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
              Type a message or choose an example:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(prompt)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "4px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  {prompt}
                </button>
              ))}
              <InputGroup
                style={{
                  marginTop: "20px",
                }}
              >
                <Form.Control
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                />
                <Button onClick={() => handleSendMessage()} disabled={isLoading || !inputValue.trim()}>
                  Send
                </Button>
              </InputGroup>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              style={{
                textAlign: message.sender === "user" ? "right" : "left",
                marginBottom: "10px",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  backgroundColor: getBotResponseColor(message),
                  color: message.sender === "user" ? "#fff" : "#000",
                }}
              >
                {message.text}
              </div>
            </div>
          ))
        )}
        {isLoading && 
        <div style={{ textAlign: "center",
        color: isDarkMode ? "#aaa" : "#666"
        }}>
          Loading...</div>
          }
      </div>
      {isChatStarted && (
        <div style={{ display: "flex", width: "999px" }}>
          <InputGroup>
            <Form.Control
              disabled={isLoading}
              className={isDarkMode ? "placeholder-dark" : "placeholder-light"}
              style={{
                backgroundColor: isDarkMode ? "#333" : "#f9f9f9",
                border: isDarkMode ? "1px solid #666" : "1px solid #ccc",
                color: isDarkMode ? "#fff" : "#000",
              }}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputValue.trim()}
              variant={isDarkMode ? "secondary" : "primary"}
            >
              Send
            </Button>
          </InputGroup>
        </div>
      )}
    </div>
  );
};

export default Chat;
