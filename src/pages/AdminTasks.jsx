// src/pages/AdminTasks.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Message from "../components/Message";

export default function AdminTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    deadline: "",
    points: "",
    type: "task",
  });
  const [message, setMessage] = useState(null);

  const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, "tasks"));
    setTasks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    if (!newTask.title || !newTask.description) {
      setMessage({ text: "املأ العنوان والوصف", type: "error" });
      return;
    }
    await addDoc(collection(db, "tasks"), {
      ...newTask,
      points: Number(newTask.points),
      createdAt: Date.now(),
      active: true,
    });
    setMessage({ text: "تم إنشاء المهمة بنجاح", type: "success" });
    setNewTask({
      title: "",
      description: "",
      deadline: "",
      points: "",
      type: "task",
    });
    fetchTasks();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    setMessage({ text: "تم حذف المهمة", type: "info" });
    fetchTasks();
  };

  const toggleActive = async (id, current) => {
    await updateDoc(doc(db, "tasks", id), { active: !current });
    setMessage({
      text: current ? "تم إغلاق المهمة" : "تم فتح المهمة",
      type: "info",
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen p-6 bg-blue-950 flex flex-col items-center gap-6">
      <h2 className="text-white text-2xl font-bold mb-4">مهام الطلاب</h2>

      {/* إضافة مهمة جديدة */}
      <div className="bg-white/10 p-6 rounded-2xl w-full max-w-md flex flex-col gap-2 text-white">
        <h3 className="text-lg font-bold mb-2">إنشاء مهمة جديدة</h3>

        <input
          className="p-2 rounded text-black"
          placeholder="عنوان المهمة"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="p-2 rounded text-black"
          placeholder="الوصف"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
        />
        <input
          type="date"
          className="p-2 rounded text-black"
          value={newTask.deadline}
          onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
        />
        <input
          type="number"
          className="p-2 rounded text-black"
          placeholder="النقاط"
          value={newTask.points}
          onChange={(e) => setNewTask({ ...newTask, points: e.target.value })}
        />
        <select
          className="p-2 rounded text-black"
          value={newTask.type}
          onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
        >
          <option value="task">Task</option>
          <option value="search">Search</option>
        </select>

        <button
          className="bg-blue-700 px-4 py-2 rounded mt-2 hover:bg-blue-800"
          onClick={handleCreateTask}
        >
          إنشاء
        </button>
      </div>

      {/* قائمة المهام */}
      <div className="w-full max-w-md flex flex-col gap-3 mt-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-4 rounded-2xl flex flex-col gap-2 shadow-lg ${
              task.active
                ? "bg-white/20 text-white"
                : "bg-gray-600 text-white/80"
            }`}
          >
            <h3 className="font-bold text-lg">{task.title}</h3>
            <p>{task.description}</p>
            <p>نقاط: {task.points}</p>
            <p>Deadline: {task.deadline || "غير محدد"}</p>
            <div className="flex gap-2 mt-2">
              <button
                className={`px-3 py-1 rounded ${
                  task.active
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
                onClick={() => toggleActive(task.id, task.active)}
              >
                {task.active ? "إغلاق المهمة" : "فتح المهمة"}
              </button>
              <button
                className="px-3 py-1 rounded bg-gray-500 hover:bg-gray-600"
                onClick={() => handleDelete(task.id)}
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>

      {message && (
        <Message
          text={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
}
