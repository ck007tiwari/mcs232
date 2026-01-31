import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import AdminQAStats from "./AdminQAStats";
import UserQAHistory from "./UserQAHistory";
import { getQAHistory } from "../../context/subjectApi";
import "./QAHistory.css";

const QAHistory = () => {
  const { isAdmin } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const endpoint = isAdmin
          ? selectedUserId
            ? `/api/qa-history/?user_id=${selectedUserId}`
            : "/api/qa-history/"
          : "/api/qa-history/";
        const { data } = await getQAHistory(endpoint);
        setData(data ?? []);
        setError(null);
      } catch (err) {
        setError("Failed to fetch Q&A history.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [isAdmin, selectedUserId]);

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const handleBackToAdminView = () => {
    setSelectedUserId(null);
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!data) {
    return <div className="no-data-message">No data available.</div>;
  }

  return (
    <div className="qa-history-container">
      <div className="qa-header">
        <h1>Q&A History</h1>
        <p>
          {isAdmin && !selectedUserId
            ? "Overview of Q&A activity across all users."
            : "Review your questions and AI-powered answers."}
        </p>
      </div>

      {isAdmin ? (
        selectedUserId ? (
          <div>
            <button
              onClick={handleBackToAdminView}
              className="mb-4 text-primary-600 hover:underline"
            >
              &larr; Back to Admin Overview
            </button>
            <UserQAHistory data={data} />
          </div>
        ) : (
          <AdminQAStats stats={data} onUserSelect={handleUserSelect} />
        )
      ) : (
        <UserQAHistory data={data} />
      )}
    </div>
  );
};

export default QAHistory;
