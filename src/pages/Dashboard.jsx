import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [student, setStudent] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;

      // بيانات الطالب الحالي
      const docRef = doc(db, "students", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setStudent(docSnap.data());

      // كل الطلاب
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

    const unsubscribe = auth.onAuthStateChanged(() => fetchData());
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <p className="text-white text-center mt-20 text-xl font-semibold">
        Loading...
      </p>
    );

  const studentPoints =
    (student?.points?.tasks || 0) +
    (student?.points?.attendance || 0) +
    (student?.points?.search || 0) +
    (student?.points?.bonus || 0);

  return (
    <div className="min-h-screen bg-blue-950 p-6 flex flex-col items-center space-y-8">
      <div className="mt-10"></div>
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">{student?.Name}</h1>
        <p>Email: {student?.Email}</p>
        <p>Phone: {student?.Phone}</p>
        <p>Age: {student?.Age}</p>
        <p>Status: {student?.Student}</p>
        <p>Level: {student?.Level}</p>
      </div>

      <div className="w-44 h-44 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shadow-lg -mt-16 z-10">
        <div className="text-center">
          <p className="text-white text-lg font-semibold">Points</p>
          <p className="text-white text-5xl font-extrabold">{studentPoints}</p>
        </div>
      </div>
      <div className="bg-blue-800 p-6 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center text-white">
          Student Rankings
        </h2>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {students.map((s, i) => (
            <div
              key={s.id}
              className={`p-2 rounded-lg flex justify-between ${
                s.id === auth.currentUser.uid
                  ? "bg-blue-500 text-white font-bold"
                  : "bg-white text-gray-700"
              }`}
            >
              <span>
                {i + 1}
                {i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"}{" "}
                {s.Name}
              </span>
              <span className="text-black font-semibold">
                {s.totalPoints} pts | Level {s.Level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
