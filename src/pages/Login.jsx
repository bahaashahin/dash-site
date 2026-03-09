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
  const [info, setInfo] = useState(""); // رسالة إعلامية لنسيت الباسورد

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
    <div
      className="flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
      style={{ backgroundColor: "#0e1526" }}
    >
      <div className="mt-10"></div>
      {/* تأثير خلفية */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <span className="absolute w-72 h-72 bg-white/5 rounded-full -top-20 -left-20 animate-pulse"></span>
        <span className="absolute w-96 h-96 bg-white/5 rounded-full -bottom-32 -right-32 animate-pulse"></span>
      </div>

      {/* الفورم */}
      <div className="relative bg-white/20 backdrop-blur-md p-10 rounded-3xl shadow-xl w-full max-w-sm z-10">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Student Login
        </h2>

        <input
          className="w-full p-3 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-green-600 text-white p-3 rounded-xl mb-4 hover:bg-green-700 transition-colors duration-300"
          onClick={handleLogin}
        >
          Login
        </button>

        {/* نسيت كلمة المرور */}
        <p className="text-center mb-3 text-gray-300">
          نسيت كلمة المرور؟{" "}
          <span
            className="text-yellow-400 hover:underline cursor-pointer"
            onClick={handleResetPassword}
          >
            اضغط هنا لإعادة التعيين
          </span>
        </p>

        {/* النص فوق زر Register */}
        <p className="text-center mb-3 text-gray-300">
          لو معندكش حساب؟{" "}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            قم بالتسجيل
          </span>
        </p>

        <button
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
          onClick={() => navigate("/register")}
        >
          Register
        </button>

        {/* كومبوننت الخطأ */}
        {error && (
          <div className="mt-4 p-3 bg-red-600 text-white border border-red-700 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* كومبوننت رسالة معلوماتية */}
        {info && (
          <div className="mt-4 p-3 bg-green-600 text-white border border-green-700 rounded-xl text-center">
            {info}
          </div>
        )}
      </div>
    </div>
  );
}
