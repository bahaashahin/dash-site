import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState("طالب");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (password !== confirmPassword) {
      setError("كلمة المرور وتأكيد كلمة المرور غير متطابقين");
      return;
    }

    try {
      const q = query(collection(db, "students"), where("Email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("الإيميل مسجل من قبل");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      const user = userCredential.user;

      await setDoc(doc(db, "students", user.uid), {
        Name: name,
        Email: email,
        Phone: phone,
        Age: age,
        Student: status,
        Level: 1,
        points: { tasks: 0, attendance: 0, search: 0, bonus: 0 },
        tasks: [],
        role: "student",
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* الخلفية */}
      <div className="mb-[100px]"></div>
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <span className="absolute w-72 h-72 bg-blue-500/10 rounded-full -top-20 -left-20 blur-3xl animate-pulse"></span>
        <span className="absolute w-96 h-96 bg-indigo-500/10 rounded-full -bottom-32 -right-32 blur-3xl animate-pulse"></span>
      </div>

      {/* الفورم */}
      <div className="relative bg-black/40 backdrop-blur-md border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-sm z-10 transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Student Register
        </h2>

        <input
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Full Name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="number"
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Age"
          onChange={(e) => setAge(e.target.value)}
        />

        <select
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="طالب">طالب</option>
          <option value="خريج">خريج</option>
        </select>

        <input
          type="password"
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          className="w-full bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-3 rounded-xl hover:from-indigo-800 hover:to-blue-800 transition-all duration-300"
          onClick={handleRegister}
        >
          Register
        </button>

        <p className="text-center mt-4 text-gray-400 text-sm">
          لديك حساب بالفعل؟{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/login")}
          >
            تسجيل الدخول
          </span>
        </p>

        {error && (
          <div className="mt-4 p-3 bg-red-600/90 text-white border border-red-700 rounded-xl text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
