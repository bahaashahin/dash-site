import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

export default function CreateTask({ refreshTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [points, setPoints] = useState("");
  const [type, setType] = useState("task");

  const handleCreate = async () => {
    if (!title || !description) return alert("املأ البيانات");

    const docRef = await addDoc(collection(db, "tasks"), {
      title,
      description,
      deadline,
      points: Number(points),
      type,
      createdAt: Date.now(),
    });

    alert("تم إنشاء المهمة");

    // إعادة تحميل المهام بعد الإضافة
    const snapshot = await getDocs(collection(db, "tasks"));
    refreshTasks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));

    setTitle("");
    setDescription("");
    setDeadline("");
    setPoints("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-white">
      <h2 className="text-2xl mb-4">إنشاء مهمة</h2>
      <input
        className="w-full mb-2 p-2 text-black"
        placeholder="عنوان المهمة"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full mb-2 p-2 text-black"
        placeholder="الوصف"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        type="date"
        className="w-full mb-2 p-2 text-black"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <input
        type="number"
        className="w-full mb-2 p-2 text-black"
        placeholder="النقاط"
        value={points}
        onChange={(e) => setPoints(e.target.value)}
      />
      <select
        className="w-full mb-4 p-2 text-black"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="task">Task</option>
        <option value="search">Search</option>
      </select>
      <button onClick={handleCreate} className="bg-blue-700 px-4 py-2 rounded">
        إنشاء
      </button>
    </div>
  );
}
