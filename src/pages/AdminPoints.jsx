import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDocs, collection, updateDoc } from "firebase/firestore";
import Message from "../components/Message";

export default function AdminPoints() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // <-- نص البحث

  const fetchStudents = async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const allStudents = [];
    querySnapshot.forEach((d) => {
      const data = d.data();
      const totalPoints =
        (data.points?.tasks || 0) +
        (data.points?.attendance || 0) +
        (data.points?.search || 0) +
        (data.points?.bonus || 0);
      allStudents.push({ id: d.id, ...data, totalPoints });
    });
    allStudents.sort((a, b) => b.totalPoints - a.totalPoints);
    setStudents(allStudents);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddPoints = async (id, addedPoints) => {
    if (!addedPoints) return;
    const studentRef = doc(db, "students", id);
    const studentData = students.find((s) => s.id === id);

    const newPoints = {
      tasks: studentData.points?.tasks || 0,
      attendance: studentData.points?.attendance || 0,
      search: studentData.points?.search || 0,
      bonus: studentData.points?.bonus || 0,
    };

    newPoints.bonus += Number(addedPoints);

    await updateDoc(studentRef, { points: newPoints });
    setMessage({
      text: `تم إضافة ${addedPoints} نقطة لـ ${studentData.Name}`,
      type: "success",
    });
    fetchStudents();
  };

  if (loading)
    return (
      <p className="text-white text-center mt-20 text-xl font-semibold">
        Loading...
      </p>
    );

  // فلترة الطلاب حسب البحث
  const filteredStudents = students.filter((s) =>
    s.Name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-blue-950 p-6 flex flex-col items-center space-y-8">
      <h1 className="text-2xl font-bold text-white">إدارة نقاط الطلاب</h1>

      {/* Search Input */}
      <input
        type="text"
        placeholder="ابحث بالاسم..."
        className="w-full max-w-md p-2 rounded text-black"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="w-full max-w-md space-y-3">
        {filteredStudents.map((s, i) => (
          <div
            key={s.id}
            className="p-4 rounded-xl bg-white/20 text-white flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <span>
                {i + 1}. {s.Name}
              </span>
              <span>
                {s.totalPoints} pts | Level {s.Level}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="أضف نقاط"
                className="p-2 rounded text-black flex-1"
                id={`points-${s.id}`}
              />
              <button
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                onClick={() =>
                  handleAddPoints(
                    s.id,
                    Number(document.getElementById(`points-${s.id}`).value),
                  )
                }
              >
                إضافة نقاط
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
