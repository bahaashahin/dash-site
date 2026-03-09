import { useState, useEffect } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import AdminTasks from "./pages/AdminTasks";
import StudentTasks from "./components/StudentTasks";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import AdminPoints from "./pages/AdminPoints";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home"; // لازم تعمل ملف Home.jsx
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const docRef = doc(db, "students", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRole(docSnap.data().role || "student");
      } else {
        setRole("student");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="text-white">Loading...</p>;

    return (
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/tasks"
            element={role === "admin" ? <AdminTasks /> : <StudentTasks />}
          />
          {/* باقي الروتس */}
          <Route path="/" element={<Home />} /> {/* الصفحة الرئيسية */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          Register
          <Route
            path="/admin-points"
            element={
              role === "admin" ? (
                <AdminPoints role={role} />
              ) : (
                <p>غير مصرح لك</p>
              )
            }
          />{" "}
          <Route path="*" element={<Home />} />{" "}
          {/* Default لأي مسار غير معرف */}
        </Routes>
      </Router>
    );
}

export default App;

