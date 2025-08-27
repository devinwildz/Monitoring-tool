import { useState, useEffect, useRef } from "react";
import { PlusIcon, CheckCircle2, XCircle, MoreVertical, Play, Pause, Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { MonitorIcon, CheckCircle2Icon, AlertTriangleIcon, BarChart2Icon } from "lucide-react";
import monitorApi from "../../Api/monitorApi.js"; // separate Axios instance
import AddMonitorModal from "../../Components/AddMonitorModel.jsx";

function UserDashboard() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [pausedMonitors, setPausedMonitors] = useState(new Set());
  const dropdownRef = useRef(null);
  const [monitors, setMonitors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [overview, setOverview] = useState({ totalMonitors: 0, online: 0, issues: 0, avgUptime: "0%" });

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const toggleMonitorPause = (monitorId) => {
    setPausedMonitors((prev) => {
      const newSet = new Set(prev);
      newSet.has(monitorId) ? newSet.delete(monitorId) : newSet.add(monitorId);
      return newSet;
    });
    setOpenDropdown(null);
  };

  // ✅ Add Monitor

  // ✅ Delete Monitor
  // const deleteMonitor = async (id) => {
  //   try {
  //     await monitorApi.delete(`/${id}`);
  //     setMonitors((prev) => prev.filter((m) => m._id !== id));
  //   } catch (err) {
  //     console.error("Error deleting monitor:", err);
  //     alert(err.response?.data?.message || "Failed to delete monitor. Please try again.");
  //   }
  // };
  const deleteMonitor = async (id) => {
    try {
      await monitorApi.delete(`/${id}`);
      // Delete ke baad fresh list fetch karo
      await fetchMonitors();
    } catch (err) {
      console.error("Error deleting monitor:", err);
      alert(err.response?.data?.message || "Failed to delete monitor. Please try again.");
    }
  };


  // ✅ Fetch all monitors
  const fetchMonitors = async () => {
    setIsLoading(true);
    try {
      const res = await monitorApi.get("/");
      // Your API returns { success: true, monitors: [...] }
      const monitorData = Array.isArray(res.data?.monitors)
        ? res.data.monitors
        : [];

      setMonitors(monitorData);

      const online = monitorData.filter((m) => m.status === "up").length;
      const issues = monitorData.length - online;
      const totalUptime = monitorData.reduce(
        (sum, m) => sum + (parseFloat(m.uptime) || 0),
        0
      );
      const avgUptime =
        monitorData.length > 0
          ? (totalUptime / monitorData.length).toFixed(1) + "%"
          : "0%";

      setOverview({ totalMonitors: monitorData.length, online, issues, avgUptime });
    } catch (err) {
      console.error("Error fetching monitors:", err);
      setMonitors([]);
      setOverview({ totalMonitors: 0, online: 0, issues: 0, avgUptime: "0%" });
      alert(err.response?.data?.message || "Failed to fetch monitors. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Add Monitor
  const addMonitor = async (data) => {
    try {
      const res = await monitorApi.post("/", data);
      if (res.data?.monitor) {
        setMonitors((prev) => [...prev, res.data.monitor]);
        await fetchMonitors();
      }
    } catch (err) {
      console.error("Error adding monitor:", err);
      if (err.response?.status === 409) {
        alert("This monitor already exists for this user.");
      } else {
        alert(err.response?.data?.message || "Failed to add monitor. Please try again.");
      }
    }
  };



  useEffect(() => {
    fetchMonitors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back!</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-green-500 hover:bg-green-600 cursor-pointer text-white font-medium py-2.5 px-5 rounded-lg shadow-sm flex items-center gap-2"
          >
            <PlusIcon className="w-4 h-4" /> Add Monitor
          </button>
          {isModalOpen && (
            <AddMonitorModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={addMonitor}
            />
          )}
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
            <MonitorIcon className="text-blue-600 w-8 h-8 mb-3" />
            <p className="text-gray-500 text-sm">Total Monitors</p>
            <p className="text-2xl font-bold">{overview.totalMonitors}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
            <CheckCircle2Icon className="text-green-600 w-8 h-8 mb-3" />
            <p className="text-gray-500 text-sm">Online</p>
            <p className="text-2xl font-bold">{overview.online}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
            <AlertTriangleIcon className="text-yellow-600 w-8 h-8 mb-3" />
            <p className="text-gray-500 text-sm">Issues</p>
            <p className="text-2xl font-bold">{overview.issues}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm">
            <BarChart2Icon className="text-blue-600 w-8 h-8 mb-3" />
            <p className="text-gray-500 text-sm">Avg Uptime</p>
            <p className="text-2xl font-bold">{overview.avgUptime}</p>
          </div>
        </div>

        {/* Monitors List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading monitors...</p>
            </div>
          ) : monitors.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border shadow-sm text-center">
              <MonitorIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Monitors Added
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Get started by adding your first monitor to track your website or service.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-5 rounded-lg shadow-sm flex items-center gap-2 mx-auto"
              >
                <PlusIcon className="w-4 h-4" /> Add Your First Monitor
              </button>
            </div>
          ) : (
            monitors.map((monitor) => (
              <div key={monitor._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border shadow-sm relative">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {monitor.status === "up" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <h3 className="text-lg font-medium">{monitor.name}</h3>
                  </div>
                  <button
                    onClick={() => toggleDropdown(monitor._id)}
                    className="p-2 hover:bg-slate-700 cursor-pointer rounded-lg"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {openDropdown === monitor._id && (
                    <div
                      className="absolute mt-2 right-5 top-15 bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-10"
                      ref={dropdownRef}
                    >
                      <Link to={`/monitor/${monitor._id}`} className="block px-4 py-2 text-sm">
                        <Eye className="inline w-4 h-4 mr-2" /> View Details
                      </Link>
                      <button
                        onClick={() => toggleMonitorPause(monitor._id)}
                        className="block w-full px-4 py-2 text-sm text-left"
                      >
                        {pausedMonitors.has(monitor._id) ? (
                          <>
                            <Play className="inline w-4 h-4 mr-2" /> Start Monitor
                          </>
                        ) : (
                          <>
                            <Pause className="inline w-4 h-4 mr-2" /> Pause Monitor
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteMonitor(monitor._id)}
                        className="block w-full px-4 py-2 text-sm text-left text-red-600"
                      >
                        <Trash2 className="inline w-4 h-4 mr-2" /> Delete Monitor
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-sm text-blue-600 truncate">{monitor.url}</p>
                <p className="text-sm text-gray-500">Frequency: {monitor.frequency} min</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
