import React, { useState, useEffect } from "react";
import { HashLink as Link } from "react-router-hash-link";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Home from "../pages/Home";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // متابعة حالة تسجيل الدخول وتحديث الـ user تلقائياً
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u); // لو المستخدم مسجل الدخول، يبقى موجود هنا حتى بعد الريفريش
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth); // تسجيل خروج عند الضغط على الزر فقط
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-950 backdrop-blur text-white fixed top-0 w-full z-50">
        <div
          className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between"
          dir="rtl"
        >
          {/* Title */}
          <div className="text-xl font-bold hidden md:block whitespace-nowrap">
            <Link to="/"> Bahaa Shaheen Website</Link>
          </div>

          {/* Links */}
          <ul className="hidden md:flex gap-4 h-10 items-center">
            {user && (
              <>
                <li>
                  <Link
                    className="text-white font-medium px-3 py-2 rounded-full hover:bg-white hover:text-[#05568d] transition-all duration-200"
                    smooth
                    to="/"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    smooth
                    to="/dashboard"
                    className="text-white font-medium px-3 py-2 rounded-full hover:bg-white hover:text-[#05568d] transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    smooth
                    to="/tasks"
                    className="text-white font-medium px-3 py-2 rounded-full hover:bg-white hover:text-[#05568d] transition-all duration-200"
                  >
                    Tasks/Form
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin-points"
                    className="text-white font-medium px-3 py-2 rounded-full hover:bg-white hover:text-[#05568d] transition-all duration-200"
                  >
                    AdminPoints
                  </Link>
                </li>
                <li>
                  <Link
                    to="/quiz"
                    className="text-white font-medium px-3 py-2 rounded-full hover:bg-white hover:text-[#05568d] transition-all duration-200"
                  >
                    Quiz
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* Logout button */}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-red-700 transition-all duration-200"
            >
              Logout
            </button>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden text-2xl"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-br from-black via-gray-900 to-blue-950 min-h-screen transition-transform duration-300 z-[9999] ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex justify-between items-center text-white">
          <span className="font-bold text-lg">القائمة</span>
          <button onClick={() => setMenuOpen(false)} className="text-2xl">
            ×
          </button>
        </div>

        <ul className="flex flex-col gap-4 px-6 text-right text-white">
          {user && (
            <>
              <Link onClick={() => setMenuOpen(false)} smooth to="/">
                Home
              </Link>
              <Link onClick={() => setMenuOpen(false)} smooth to="/dashboard">
                Dashboard
              </Link>
              <Link onClick={() => setMenuOpen(false)} smooth to="/tasks">
                Tasks/Form
              </Link>
              <Link
                onClick={() => setMenuOpen(false)}
                smooth
                to="/admin-points"
              >
                AdminPoints
              </Link>
              <Link onClick={() => setMenuOpen(false)} smooth to="/quiz">
                Quiz
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-600 px-4 py-2 rounded-lg text-white font-semibold"
              >
                Logout
              </button>
            </>
          )}
          {!user && (
            <Link onClick={() => setMenuOpen(false)} smooth to="/login">
              Login
            </Link>
          )}
        </ul>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/50 z-[9998]"
        />
      )}
    </>
  );
}

export default Navbar;
