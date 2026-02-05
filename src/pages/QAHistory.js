import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import AdminQAStats from "../components/QA/AdminQAStats";
import UserQAHistory from "../components/QA/UserQAHistory";
import { getQAHistory } from "../context/subjectApi";
import "../components/QA/QAHistory.css";

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
            ? `/users/qa-history/?user_id=${selectedUserId}`
            : "/users/qa-history/"
          : "/users/qa-history/";
        const { data } = await getQAHistory(endpoint);
        
        // Transform data to match UserQAHistory expectation
        const formattedData = (data ?? []).map(item => ({
          question_id: item.id,
          question_text: item.question,
          answer_text: item.answer,
          timestamp: item.created_at,
          pdfId: item.subject_file,
          pdf_id: item.subject_file, // Component uses both in different places
          confidence_score: 0.95, // Default
          page_context: 1 // Default
        }));

        setData({ questions: formattedData, total_questions: formattedData.length, pdfs_discussed: new Set(formattedData.map(d => d.pdfId)).size, avg_confidence: 0.95 });
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
    <div className="qa-history-container dark:bg-dark-primary">
      <div className="qa-header">
        <h1 className="dark:text-gray-100">Q&A History</h1>
        <p className="dark:text-gray-300">
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
              className="mb-4 text-primary-600 hover:underline dark:text-primary-400"
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
