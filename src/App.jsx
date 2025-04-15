import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const App = () => {
  // Retrieve data from localStorage or use default data
  const getInitialDays = () => {
    const storedDays = localStorage.getItem("days");
    return storedDays
      ? JSON.parse(storedDays)
      : [
          {
            name: "Monday",
            planned: [
              {
                activity: "Study",
                startTime: "08:00",
                endTime: "10:00",
                category: "education",
              },
              {
                activity: "Project",
                startTime: "11:00",
                endTime: "13:00",
                category: "work",
              },
            ],
            actual: [
              {
                activity: "Study",
                startTime: "08:30",
                endTime: "10:30",
                category: "education",
              },
              {
                activity: "Social Media",
                startTime: "11:00",
                endTime: "12:30",
                category: "distraction",
              },
            ],
          },
          {
            name: "Tuesday",
            planned: [
              {
                activity: "Research",
                startTime: "09:00",
                endTime: "11:00",
                category: "work",
              },
              {
                activity: "Meeting",
                startTime: "14:00",
                endTime: "15:00",
                category: "work",
              },
            ],
            actual: [
              {
                activity: "Research",
                startTime: "10:00",
                endTime: "11:30",
                category: "work",
              },
              {
                activity: "Extended Meeting",
                startTime: "14:30",
                endTime: "16:00",
                category: "work",
              },
            ],
          },
          {
            name: "Wednesday",
            planned: [
              {
                activity: "Writing",
                startTime: "08:00",
                endTime: "10:00",
                category: "work",
              },
              {
                activity: "Team Discussion",
                startTime: "13:00",
                endTime: "14:00",
                category: "work",
              },
            ],
            actual: [
              {
                activity: "Writing",
                startTime: "08:30",
                endTime: "10:30",
                category: "work",
              },
              {
                activity: "Extended Discussion",
                startTime: "13:15",
                endTime: "14:45",
                category: "work",
              },
            ],
          },
          {
            name: "Thursday",
            planned: [
              {
                activity: "Exercise",
                startTime: "07:00",
                endTime: "08:00",
                category: "health",
              },
              {
                activity: "Coding",
                startTime: "10:00",
                endTime: "12:00",
                category: "work",
              },
            ],
            actual: [
              {
                activity: "Exercise",
                startTime: "07:15",
                endTime: "08:15",
                category: "health",
              },
              {
                activity: "Debugging",
                startTime: "10:30",
                endTime: "12:30",
                category: "work",
              },
            ],
          },
          {
            name: "Friday",
            planned: [
              {
                activity: "Reading",
                startTime: "09:00",
                endTime: "10:00",
                category: "education",
              },
              {
                activity: "Team Meeting",
                startTime: "15:00",
                endTime: "16:00",
                category: "work",
              },
            ],
            actual: [
              {
                activity: "Reading",
                startTime: "09:15",
                endTime: "10:15",
                category: "education",
              },
              {
                activity: "Extended Team Meeting",
                startTime: "15:30",
                endTime: "16:30",
                category: "work",
              },
            ],
          },
          {
            name: "Saturday",
            planned: [
              {
                activity: "Gardening",
                startTime: "08:00",
                endTime: "09:00",
                category: "leisure",
              },
              {
                activity: "Research",
                startTime: "11:00",
                endTime: "13:00",
                category: "work",
              },
            ],
            actual: [
              {
                activity: "Gardening",
                startTime: "08:30",
                endTime: "09:30",
                category: "leisure",
              },
              {
                activity: "Research",
                startTime: "11:15",
                endTime: "13:15",
                category: "work",
              },
            ],
          },
          {
            name: "Sunday",
            planned: [
              {
                activity: "Meditation",
                startTime: "07:00",
                endTime: "07:30",
                category: "health",
              },
              {
                activity: "Family Time",
                startTime: "18:00",
                endTime: "20:00",
                category: "leisure",
              },
            ],
            actual: [
              {
                activity: "Meditation",
                startTime: "07:05",
                endTime: "07:35",
                category: "health",
              },
              {
                activity: "Family Time",
                startTime: "18:15",
                endTime: "20:15",
                category: "leisure",
              },
            ],
          },
        ];
  };

  const [days, setDays] = useState(getInitialDays);
  const [activeDay, setActiveDay] = useState(0);
  const [newActivity, setNewActivity] = useState({
    name: "",
    startTime: "08:00",
    endTime: "09:00",
    category: "work",
    type: "planned",
  });

  // Save days to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("days", JSON.stringify(days));
  }, [days]);

  // Calculate time metrics
  const calculateMetrics = () => {
    let totalPlanned = 0;
    let totalActual = 0;
    let efficiency = 0;
    const deviations = [];
    const categoryData = {};

    days[activeDay].planned.forEach((planned, index) => {
      const plannedStart = new Date(`2000-01-01T${planned.startTime}`);
      const plannedEnd = new Date(`2000-01-01T${planned.endTime}`);
      const plannedDuration = (plannedEnd - plannedStart) / (1000 * 60);
      totalPlanned += plannedDuration;

      const actual = days[activeDay].actual[index];
      if (actual) {
        const actualStart = new Date(`2000-01-01T${actual.startTime}`);
        const actualEnd = new Date(`2000-01-01T${actual.endTime}`);
        const actualDuration = (actualEnd - actualStart) / (1000 * 60);
        totalActual += actualDuration;

        const deviation = (actualStart - plannedStart) / (1000 * 60);
        deviations.push({
          name: planned.activity,
          deviation,
        });

        // Category tracking
        if (!categoryData[planned.category]) {
          categoryData[planned.category] = { planned: 0, actual: 0 };
        }
        categoryData[planned.category].planned += plannedDuration;
        categoryData[actual.category] = categoryData[actual.category] || {
          planned: 0,
          actual: 0,
        };
        categoryData[actual.category].actual += actualDuration;
      }
    });

    efficiency =
      totalPlanned > 0 ? Math.round((totalActual / totalPlanned) * 100) : 0;

    return {
      efficiency,
      deviations,
      categoryData: Object.entries(categoryData).map(([name, data]) => ({
        name,
        planned: data.planned / 60, // Convert to hours
        actual: data.actual / 60,
      })),
    };
  };

  const { efficiency, deviations, categoryData } = calculateMetrics();

  const addActivity = () => {
    if (!newActivity.name.trim()) {
      alert("Activity name cannot be empty!");
      return;
    }

    const updatedDays = [...days];
    const activity = {
      activity: newActivity.name,
      startTime: newActivity.startTime,
      endTime: newActivity.endTime,
      category: newActivity.category,
    };

    if (newActivity.type === "planned") {
      updatedDays[activeDay].planned.push(activity);
    } else {
      updatedDays[activeDay].actual.push(activity);
    }

    setDays(updatedDays);
    setNewActivity({
      name: "",
      startTime: "08:00",
      endTime: "09:00",
      category: "work",
      type: "planned",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            PlanSync
          </h1>
          <p className="text-gray-600">
            Bridge the gap between what you plan and what you actually do.
          </p>
        </motion.div>

        {/* Day Selector */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
          {days.map((day, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveDay(index)}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                activeDay === index
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              } transition shadow-sm`}
            >
              {day.name}
            </motion.button>
          ))}
        </div>

        {/* Add Activity Form */}
        <motion.div className="bg-white rounded-xl shadow-md  p-4 mb-6">
          <h3 className="font-medium mb-3">Add New Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Activity name"
              className="col-span-2 p-2 border rounded"
              value={newActivity.name}
              onChange={(e) =>
                setNewActivity({ ...newActivity, name: e.target.value })
              }
            />
            <select
              className="p-2 border rounded"
              value={newActivity.type}
              onChange={(e) =>
                setNewActivity({ ...newActivity, type: e.target.value })
              }
            >
              <option value="planned">Planned</option>
              <option value="actual">Actual</option>
            </select>
            <select
              className="p-2 border rounded"
              value={newActivity.category}
              onChange={(e) =>
                setNewActivity({ ...newActivity, category: e.target.value })
              }
            >
              <option value="work">Work</option>
              <option value="education">Study</option>
              <option value="health">Health</option>
              <option value="distraction">Distraction</option>
              <option value="other">Other</option>
            </select>
            <button
              onClick={addActivity}
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
            >
              Add Activity
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                Start Time
              </label>
              <input
                type="time"
                className="p-2 border rounded w-full"
                value={newActivity.startTime}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">
                End Time
              </label>
              <input
                type="time"
                className="p-2 border rounded w-full"
                value={newActivity.endTime}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, endTime: e.target.value })
                }
              />
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Timeline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium text-gray-700">
              <div className="col-span-4">Activity</div>
              <div className="col-span-3 text-center">Planned Time</div>
              <div className="col-span-3 text-center">Actual Time</div>
              <div className="col-span-2 text-center">Deviation</div>
            </div>

            {days[activeDay].planned.map((planned, index) => {
              const actual = days[activeDay].actual[index] || {};
              const plannedStart = new Date(`2000-01-01T${planned.startTime}`);
              const actualStart = actual.startTime
                ? new Date(`2000-01-01T${actual.startTime}`)
                : null;
              const deviation = actualStart
                ? (actualStart - plannedStart) / (1000 * 60)
                : null;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="grid grid-cols-12 items-center p-3 border-b border-gray-100 hover:bg-blue-50/50 transition"
                >
                  <div className="col-span-4 font-medium flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        planned.category === "work"
                          ? "bg-blue-500"
                          : planned.category === "education"
                          ? "bg-green-500"
                          : planned.category === "health"
                          ? "bg-purple-500"
                          : planned.category === "distraction"
                          ? "bg-red-500"
                          : "bg-gray-500"
                      }`}
                    />
                    {planned.activity}
                  </div>

                  <div className="col-span-3 text-center text-blue-600">
                    {planned.startTime} - {planned.endTime}
                  </div>

                  <div className="col-span-3 text-center text-purple-600">
                    {actual.startTime || "--"} - {actual.endTime || "--"}
                  </div>

                  <div
                    className={`col-span-2 text-center ${
                      !deviation
                        ? "text-gray-400"
                        : Math.abs(deviation) > 30
                        ? "text-red-500"
                        : deviation > 0
                        ? "text-orange-500"
                        : "text-green-500"
                    }`}
                  >
                    {deviation !== null
                      ? `${deviation > 0 ? "+" : ""}${deviation} min`
                      : "--"}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Charts Sidebar */}
          <div className="space-y-6">
            {/* Efficiency Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <h3 className="font-bold text-lg mb-2">Daily Efficiency</h3>
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                  style={{ width: `${efficiency}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {efficiency}% of planned activities completed
              </p>
            </motion.div>

            {/* Deviation Chart */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <h3 className="font-bold text-lg mb-4">Time Deviations</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={deviations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      label={{
                        value: "Minutes",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Bar
                      dataKey="deviation"
                      fill="#8884d8"
                      name="Deviation (min)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Category Comparison */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-4"
            >
              <h3 className="font-bold text-lg mb-4">Category Comparison</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                      label={{
                        value: "Hours",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />
                    <Tooltip />
                    <Bar dataKey="planned" fill="#3b82f6" name="Planned" />
                    <Bar dataKey="actual" fill="#8b5cf6" name="Actual" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
