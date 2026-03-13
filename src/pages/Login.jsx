import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleLogin = async () => {
    setError("");
    setInfo("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
    } catch (err) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setInfo("");
    if (!email) {
      setError("من فضلك أدخل البريد الإلكتروني لإرسال رابط إعادة التعيين");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (err) {
      setError("حدث خطأ أثناء إرسال الرابط: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* خلفية bubbles */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <span className="absolute w-72 h-72 bg-blue-500/10 rounded-full -top-20 -left-20 blur-3xl animate-pulse"></span>
        <span className="absolute w-96 h-96 bg-indigo-500/10 rounded-full -bottom-32 -right-32 blur-3xl animate-pulse"></span>
      </div>

      {/* الكارد */}
      <div className="relative bg-black/40 backdrop-blur-md border border-white/10 p-10 rounded-3xl shadow-2xl w-full max-w-sm z-10 transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Student Login
        </h2>

        <input
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 bg-white/10 text-white border border-white/10 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-gradient-to-r from-indigo-700 to-blue-700 text-white p-3 rounded-xl mb-4 hover:from-indigo-800 hover:to-blue-800 transition-all duration-300"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* نسيت كلمة المرور */}
        <p className="text-center mb-3 text-gray-400 text-sm">
          نسيت كلمة المرور؟{" "}
          <span
            className="text-yellow-400 hover:underline cursor-pointer"
            onClick={handleResetPassword}
          >
            اضغط هنا لإعادة التعيين
          </span>
        </p>

        {/* التسجيل */}
        <p className="text-center mb-3 text-gray-400 text-sm">
          لو معندكش حساب؟{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            قم بالتسجيل
          </span>
        </p>

        <button
          className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-3 rounded-xl hover:from-blue-800 hover:to-indigo-800 transition-all duration-300"
          onClick={() => navigate("/register")}
        >
          Register
        </button>

        {/* رسالة الخطأ */}
        {error && (
          <div className="mt-4 p-3 bg-red-600/90 text-white border border-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* رسالة النجاح */}
        {info && (
          <div className="mt-4 p-3 bg-green-600/90 text-white border border-green-700 rounded-xl text-center">
            {info}
          </div>
        )}
      </div>
    </div>
  );
}
