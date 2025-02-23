import React from "react";
import NewsFeed from "../components/NewsFeed";

const Planning: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 mt-4">The Latest News</h1>
      <NewsFeed />
    </div>
  );
};

export default Planning;