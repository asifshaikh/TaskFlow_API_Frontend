import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tasksAPI } from "../services/api";
import { FiCheckCircle } from "react-icons/fi";

const TaskCard = ({ task , refreshStats}) => {
  const navigate = useNavigate();

  // Local state for smooth toggle
  const [status, setStatus] = useState(task.status);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "medium":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleStatus = async () => {
    const newStatus = status === "PENDING" ? "COMPLETED" : "PENDING";

    // Optimistically update UI immediately
    setStatus(newStatus);

    try {
      await tasksAPI.updateTask(task.task_id, { status: newStatus });
      refreshStats();
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
      setStatus(status); // rollback if API fails
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/task/${task.task_id}`)}
    >
      <div className="flex justify-between items-start">
        {/* LEFT */}
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {formatDate(task.due_date)}
          </p>

          <div className="flex gap-2 mt-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                status
              )}`}
            >
              {status}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                task.priority
              )}`}
            >
              {task.priority}
            </span>
          </div>
        </div>

        {/* RIGHT ICON BUTTON */}
        <div className="flex space-x-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus();
            }}
            className={`p-2 rounded-full transition ${
              status === "PENDING"
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
            title={status === "PENDING" ? "Mark Completed" : "Mark Pending"}
          >
            <FiCheckCircle size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
