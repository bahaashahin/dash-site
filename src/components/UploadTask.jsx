import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  addDoc,
} from "firebase/firestore";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const snapshot = await getDocs(collection(db, "tasks"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setTasks(data);
    };

    fetchTasks();
  }, []);

  const handleUpload = async (task) => {
    if (!file) return alert("ارفع الملف أولا");

    const user = auth.currentUser;

    try {
      // حفظ الحل
      await addDoc(collection(db, "submissions"), {
        studentId: user.uid,
        taskId: task.id,
        type: task.type,
        createdAt: Date.now(),
      });

      // جلب بيانات الطالب
      const studentRef = doc(db, "students", user.uid);
      const studentSnap = await getDoc(studentRef);
      const studentData = studentSnap.data();

      const pointsToAdd = task.type === "task" ? 10 : 5;

      const updatedPoints = {
        ...studentData.points,
        [task.type]: (studentData.points?.[task.type] || 0) + pointsToAdd,
      };

      await updateDoc(studentRef, { points: updatedPoints });

      alert("تم رفع المهمة وإضافة النقاط");
    } catch (err) {
      console.log(err);
      alert("حدث خطأ");
    }
  };

  return (
    <div className="min-h-screen bg-blue-950 p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">Tasks</h2>

      {tasks.map((task) => (
        <div key={task.id} className="bg-blue-800 p-4 mb-4 rounded-xl">
          <h3 className="text-xl">{task.title}</h3>
          <p>{task.description}</p>
          <p>Deadline: {task.deadline}</p>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mt-2"
          />

          <button
            onClick={() => handleUpload(task)}
            className="mt-2 bg-green-600 px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      ))}
    </div>
  );
}
