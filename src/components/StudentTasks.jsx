// src/pages/StudentTasks.jsx
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, "tasks"));
    setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleComplete = (taskId) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  return (
    <div className="min-h-screen p-6 bg-blue-950 flex flex-col items-center gap-6">
      <h2 className="text-white text-2xl font-bold mb-4">المهام المخصصة لك</h2>

      {/* كارد رابط الفورم */}
      <div className="w-full max-w-md p-4 rounded-2xl bg-blue-900 text-white shadow-lg mb-4">
        <h3 className="font-bold text-lg mb-2">نموذج للطلاب</h3>
        <a href="#" className="text-blue-200 underline hover:text-white">
          اضغط هنا لفتح النموذج
        </a>
      </div>

      {/* المهام */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        {tasks.length === 0 && (
          <p className="text-white/70 text-center">لا توجد أي مهام</p>
        )}
        {tasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);
          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl shadow-lg flex flex-col gap-2 transition-colors duration-300 ${
                isCompleted
                  ? "bg-green-600 text-white"
                  : "bg-blue-800 text-white"
              }`}
            >
              <h3 className="font-bold text-lg">{task.title}</h3>
              <p>{task.description}</p>
              <p>نقاط: {task.points}</p>
              <p>Deadline: {task.deadline || "غير محدد"}</p>
              <button
                onClick={() => handleComplete(task.id)}
                className={`mt-2 px-3 py-1 rounded ${
                  isCompleted
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-blue-700 hover:bg-blue-900"
                }`}
              >
                {isCompleted ? "تم الإنجاز" : "أكمل المهمة"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
