import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";

export default function UploadTask() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [taskType, setTaskType] = useState("task"); // task or search
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // جلب كل الطلاب
  useEffect(() => {
    const fetchStudents = async () => {
      const snapshot = await getDocs(collection(db, "students"));
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setStudents(data);
    };
    fetchStudents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !file) return;

    try {
      const studentRef = doc(db, "students", selectedStudent);

      // جلب بيانات الطالب الحالي
      const studentSnap =
        (await studentRef.get?.()) ||
        (await getDocs(doc(db, "students", selectedStudent)));
      const studentData = studentSnap.data
        ? studentSnap.data()
        : studentSnap.data();

      // تحديد النقاط
      const pointsToAdd = taskType === "task" ? 10 : 5;
      const updatedPoints = {
        ...studentData.points,
        [taskType]: (studentData.points?.[taskType] || 0) + pointsToAdd,
      };

      // تحديث الطالب
      await updateDoc(studentRef, { points: updatedPoints });

      setSubmitted(true);
      alert(`${taskType === "task" ? "Task" : "Search"} added successfully!`);
    } catch (err) {
      console.log(err);
      alert("حدث خطأ أثناء رفع النقاط");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0e1526] p-6">
      <h2 className="text-white text-2xl font-bold mb-6">
        Upload Task / Search
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl flex flex-col gap-4 w-full max-w-md"
      >
        <label className="text-white">Select Student:</label>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="p-3 rounded-xl bg-white/20 text-gray-800"
          disabled={submitted}
        >
          <option value="">-- اختر طالب --</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.Name} - Level {s.Level}
            </option>
          ))}
        </select>

        <label className="text-white">Task Type:</label>
        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value)}
          className="p-3 rounded-xl bg-white/20 text-gray-800"
          disabled={submitted}
        >
          <option value="task">Task (10 points)</option>
          <option value="search">Search (5 points)</option>
        </select>

        <label className="text-white">Upload File:</label>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          disabled={submitted}
          className="text-white"
        />

        <button
          type="submit"
          className={`p-3 rounded-xl font-bold ${
            submitted
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
          disabled={submitted}
        >
          {submitted ? "تم الرفع" : "رفع"}
        </button>
      </form>
    </div>
  );
}
