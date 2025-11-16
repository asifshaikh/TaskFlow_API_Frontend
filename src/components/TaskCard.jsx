import { useNavigate } from "react-router-dom";
import { tasksAPI } from "../services/api";
import { FiCheckCircle, FiEye } from "react-icons/fi";

const TaskCard = ({ task, onUpdate }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase();
    switch (normalized) {
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
   const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority) => {
    const normalized = priority?.toLowerCase();
    switch (normalized) {
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

  const markCompleted = async () => {
    try {
      await tasksAPI.updateTask(task.task_id, { status: "COMPLETED" });
      onUpdate();
    } catch (err) {
      alert("Failed to mark complete");
      console.log(err);
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 cursor-pointer hover:shadow-lg transition"
      onClick={() => navigate(`/task/${task.task_id}`)}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <h3 className="text-sm">{formatDate(task.due_date)}</h3>

      {/* STATUS + PRIORITY */}
      <div className="flex gap-2 mt-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status}
        </span>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
            task.priority
          )}`}
        >
          {task.priority}
        </span>
      </div>

      {/* ICON BUTTONS */}
      <div className="flex space-x-3 mt-4">

        {/* Mark Completed (only if pending) */}
        {task.status === "PENDING" && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              markCompleted();
            }}
            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
            title="Mark Completed"
          >
            <FiCheckCircle size={18} />
          </button>
        )}

        {/* View details */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/task/${task.task_id}`);
          }}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
          title="View Details"
        >
          <FiEye size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
