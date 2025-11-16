import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { tasksAPI } from "../services/api";
import { FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchTask = async () => {
    const res = await tasksAPI.getTask(id);
    const taskData = res.data;

    setTask(taskData);

    setFormData({
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      priority: taskData.priority,
      due_date: taskData.due_date?.split("T")[0] || "",
    });
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const handleUpdate = async () => {
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    for (let f of files) data.append("images", f);

    await tasksAPI.updateTask(id, data, true);
    alert("Task updated");
    setIsEditing(false);
    fetchTask();
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete this task?")) return;
    await tasksAPI.deleteTask(id);
    navigate("/");
  };

  if (!task) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-5 max-w-xl mx-auto relative pb-20">
      <h1 className="text-2xl font-bold mb-4 text-center">{task.title}</h1>

      {/* IMAGES */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {task.images?.length > 0 ? (
          task.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="task"
              className="w-full h-28 object-cover rounded-lg border"
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm col-span-3 text-center">
            No images
          </p>
        )}
      </div>

      {/* VIEW MODE */}
      {!isEditing && (
        <div className="space-y-3">
          <div>
            <p className=" text-sm font-semibold">Description</p>
            <p className="">{task.description || "No description"}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p>
              <strong>Due Date:</strong> {task.due_date?.split("T")[0]}
            </p>
          </div>
        </div>
      )}

      {/* EDIT MODE */}
      {isEditing && (
        <div className="space-y-3 mt-4">
          <input
            className="w-full p-2 border rounded-md text-sm"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <textarea
            className="w-full h-48 p-4 border border-gray-300 rounded-xl text-base dark:bg-gray-800 dark:text-white"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              className="p-2 border rounded-md text-sm"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
            </select>

            <select
              className="p-2 border rounded-md text-sm"
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          <input
            type="date"
            className="w-full p-2 border rounded-md text-sm"
            value={formData.due_date}
            onChange={(e) =>
              setFormData({ ...formData, due_date: e.target.value })
            }
          />

          <input
            type="file"
            multiple
            className="w-full p-2 border rounded-md text-sm"
            onChange={(e) => setFiles([...e.target.files])}
          />
        </div>
      )}

      <div className="fixed bottom-20 right-6 flex flex-col gap-3">
        {/* EDIT BUTTON */}
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="p-3 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700"
            title="Edit Task"
          >
            <FiEdit2 size={18} />
          </button>
        )}

        {/* DELETE BUTTON */}
        {!isEditing && (
          <button
            onClick={deleteTask}
            className="p-3 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700"
            title="Delete Task"
          >
            <FiTrash2 size={18} />
          </button>
        )}

        {/* SAVE BUTTON */}
        {isEditing && (
          <button
            onClick={handleUpdate}
            className="p-3 bg-green-600 text-white rounded-full shadow-md hover:bg-green-700"
            title="Save Changes"
          >
            <FiSave size={18} />
          </button>
        )}

        {/* CANCEL BUTTON */}
        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="p-3 bg-gray-600 text-white rounded-full shadow-md hover:bg-gray-700"
            title="Cancel"
          >
            <FiX size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskDetails;
