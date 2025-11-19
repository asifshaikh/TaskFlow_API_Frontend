import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { tasksAPI } from "../services/api";
import TaskCard from "../components/TaskCard";

// AOS IMPORT
import AOS from "aos";
import "aos/dist/aos.css";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("");

  // NEW AOS INIT
  useEffect(() => {
    AOS.init({ duration: 700, once: true, offset: 40 });
  }, []);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    due_date: "",
    images: null,
  });

  const fetchStats = async () => {
    try {
      const statsData = await tasksAPI.getTaskStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = { page, per_page: 10 };

      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      if (search) params.search = search;

      const response = await tasksAPI.getTasks(params);
      let tasks = response.data?.tasks;

      // Date Filter
      if (startDate) tasks = tasks.filter((t) => t.due_date && t.due_date >= startDate);
      if (endDate) tasks = tasks.filter((t) => t.due_date && t.due_date <= endDate);

      // Sorting
      if (sortBy === "due_asc") tasks = [...tasks].sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
      if (sortBy === "due_desc") tasks = [...tasks].sort((a, b) => new Date(b.due_date) - new Date(a.due_date));

      if (sortBy === "priority_high_low") {
        const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        tasks = [...tasks].sort((a, b) => order[b.priority] - order[a.priority]);
      }

      if (sortBy === "priority_low_high") {
        const order = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        tasks = [...tasks].sort((a, b) => order[a.priority] - order[b.priority]);
      }

      setTasks(tasks);
      setTotalPages(response.data.total_pages || 1);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, priorityFilter, startDate, endDate, sortBy, search]);

  useEffect(() => {
    fetchStats();
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [search]);

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", newTask.title);
      formData.append("description", newTask.description);
      formData.append("status", newTask.status);
      formData.append("priority", newTask.priority);
      formData.append("due_date", newTask.due_date);

      if (newTask.images && newTask.images.length > 0) {
        for (let i = 0; i < newTask.images.length; i++) {
          formData.append("images", newTask.images[i]);
        }
      }

      await tasksAPI.createTask(formData);

      setShowCreateModal(false);
      setNewTask({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        due_date: "",
        images: null,
      });

      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error("Error creating task:", error);
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Failed to create task";
      alert(msg);
    }
  };

  const total_tasks = stats
    ? Number(stats.data.status_counts?.PENDING || 0) +
      Number(stats.data.status_counts?.COMPLETED || 0)
    : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Welcome Section */}
        <div className="mb-8" data-aos="fade-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            {getGreeting()},{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent inline-block leading-tight">
              {user?.name || "User"}
            </span>
            <span className="wave-emoji">👋</span>
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            Here's your task management dashboard
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Total Tasks
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {total_tasks}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Pending
              </div>
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.data.status_counts.PENDING || 0}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Completed
              </div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.data.status_counts.COMPLETED || 0}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl hover:-translate-y-1 transition-all">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Overdue
              </div>
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.data.overdue_count || 0}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700"
          data-aos="fade-up"
          data-aos-delay="250"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <input
                type="text"
                placeholder="Search tasks by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border  border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white dark:bg-gray-700"
            />

            <div className="relative inline-block group">
              <div
                className="
                  absolute inset-0 rounded-lg p-[2px] pointer-events-none
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-300
                "
              >
                <div
                  className="
                    absolute inset-0 rounded-lg 
                    bg-[conic-gradient(from_0deg,#a855f7,#3b82f6,#9333ea,#a855f7)]
                    animate-none group-hover:animate-spin-border
                  "
                ></div>
              </div>

              <div className="absolute inset-[3px] bg-white dark:bg-gray-700 rounded-lg pointer-events-none"></div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="
                  relative z-10 px-4 py-2 w-full rounded-lg
                  bg-transparent dark:text-white text-gray-900
                  dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                  hover:scale-[1.02] hover:shadow-md
                  transition-all duration-200
                  focus:ring-2 focus:ring-purple-500 focus:border-purple-500
                  cursor-pointer
                "
              >
                <option value="">Sort</option>
                <option value="due_asc">Due Date ↑</option>
                <option value="due_desc">Due Date ↓</option>
                <option value="priority_high_low">Priority: High → Low</option>
                <option value="priority_low_high">Priority: Low → High</option>
              </select>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="group px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white 
                          rounded-lg font-medium hover:scale-105 transition-all flex items-center gap-2"
            >
              <span className="inline-block transition-transform duration-900 group-hover:rotate-2880">
                +
              </span>
              Create Task
            </button>
          </div>
        </div>

        {/* Task List Section */}
        {loading ? (
          <div className="text-center py-12" data-aos="fade-up">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
            data-aos="fade-up"
          >
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Get started by creating a new task.
            </p>
          </div>
        ) : (
          <>
            {/* Task List */}
            <div className="flex flex-col gap-6 mb-8" data-aos="fade-up" data-aos-delay="200">
              {tasks.map((task, index) => (
                <div
                  key={task.task_id ?? task.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  className="transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg bg-transparent rounded-xl"
                >
                  <TaskCard task={task} refreshStats={fetchStats} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2" data-aos="fade-up">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`relative px-7 py-2 rounded-lg text-white font-medium transition-all duration-300 ${
                    page === 1
                      ? "bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:shadow-lg hover:from-purple-500 hover:to-blue-600 transform hover:scale-[1.05]"
                  }`}
                >
                  Previous
                </button>

                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`relative px-7 py-2 rounded-lg text-white font-medium transition-all duration-500 ${
                    page === totalPages
                      ? "bg-gray-300 dark:bg-gray-800 text-gray-700 dark:text-gray-300 shadow-md cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-blue-500 to-purple-600 shadow-md hover:shadow-lg hover:from-purple-500 hover:to-blue-600 transform hover:scale-[1.05]"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Create Task Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Create New Task
              </h2>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    rows="3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Priority
                    </label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={newTask.due_date}
                    onChange={(e) =>
                      setNewTask({ ...newTask, due_date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Images
                  </label>

                  <input
                    type="file"
                    name="images"
                    multiple
                    onChange={(e) =>
                      setNewTask({
                        ...newTask,
                        images: Array.from(e.target.files),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
                  >
                    Create Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
