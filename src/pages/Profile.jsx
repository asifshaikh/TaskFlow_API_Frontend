import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authAPI, notificationsAPI } from "../services/api";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";



const Profile = () => {
  const { user, token, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    password: "",
  });
  const [saving, setSaving] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("none");
  const [loadingSub, setLoadingSub] = useState(false);
const navigate = useNavigate();


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await notificationsAPI.getStatus();
        if (res.data.success) {
          setSubscriptionStatus(res.data.status);
        }
      } catch (err) {
        console.error("Failed to load subscription status", err);
      }
    };

    fetchStatus();
  }, []);

  const handleSubscribe = async () => {
    setLoadingSub(true);

    try {
      const res = await notificationsAPI.subscribe();

      if (res.data.subscription === "Confirmation email sent") {
        alert("Confirmation email sent. Please check your inbox.");

        setSubscriptionStatus("pending"); // update UI
      }

      if (res.data.subscription === "Email already subscribed") {
        setSubscriptionStatus("confirmed");
      }

      if (res.data.subscription === "Email pending confirmation") {
        setSubscriptionStatus("pending");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to subscribe");
    } finally {
      setLoadingSub(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoadingSub(true);

    try {
      await notificationsAPI.unsubscribe();
      alert("Successfully unsubscribed");

      setSubscriptionStatus("none");
    } catch (err) {
      console.error(err);
      alert("Failed to unsubscribe");
    } finally {
      setLoadingSub(false);
    }
  };

return (
  <div>
  
         <button
      onClick={() => navigate("/")}
      className="fixed left-24 top-24 px-4 py-2 bg-gray-200 dark:bg-gray-700 
                 text-gray-800 dark:text-gray-200 rounded-md shadow 
                 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
    >
       <IoArrowBack size={20} />
    </button>
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">

    {/* PROFILE SECTION FIRST */}
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Profile
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-200 dark:border-gray-700">
  <div className="flex space-x-72 ">

        {/* Avatar + Name */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {user?.name || "User"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Edit button */}
        <div className="flex justify-end w-36 h-12 m-6 ">
          <button
            onClick={() => setIsEditing((s) => !s)}
            className="px-4 py-2 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-md hover:bg-blue-600 transition"
          >
            {isEditing ? "Close" : "Edit Profile"}
          </button>
        </div>
        
  </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2 mb-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password (leave blank to keep current)
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />

            <div className="flex space-x-2 mt-4">
              <button
                onClick={async () => {
                  setSaving(true);
                  try {
                    const payload = { name: form.name };
                    if (form.password) payload.password = form.password;

                    const resp = await authAPI.updateCurrentUser(payload);
                    const updatedUser = resp?.user || resp?.data || resp || {};

                    login(updatedUser, token);
                    setForm((f) => ({ ...f, password: "" }));
                    setIsEditing(false);
                    alert("Profile updated successfully");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to update profile");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                {saving ? "Saving..." : "Update"}
              </button>

              <button
                onClick={() => {
                  setIsEditing(false);
                  setForm({ name: user?.name || "", password: "" });
                }}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Static profile details */}
        <div className="space-y-4 mt-6">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              User ID
            </label>
            <p className="text-gray-900 dark:text-white">{user?.user_id}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <p className="text-gray-900 dark:text-white">{user?.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <p className="text-gray-900 dark:text-white">{user?.name}</p>
          </div>
        </div>
      </div>
    </div>

    {/*  EMAIL NOTIFICATIONS SECTION MOVED TO BOTTOM */}
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-white">
        Email Notifications
      </h3>

      {subscriptionStatus === "none" && (
        <button
          onClick={handleSubscribe}
          disabled={loadingSub}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loadingSub ? "Processing..." : "Subscribe to Notifications"}
        </button>
      )}

      {subscriptionStatus === "pending" && (
        <p className="text-yellow-500 font-medium">
          Confirmation pending — please check your email!
        </p>
      )}

      {subscriptionStatus === "confirmed" && (
        <button
          onClick={handleUnsubscribe}
          disabled={loadingSub}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          {loadingSub ? "Processing..." : "Unsubscribe"}
        </button>
      )}
    </div>

  </div>
  </div>
);
}

export default Profile;
