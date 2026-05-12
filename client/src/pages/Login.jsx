import React from "react";
import { User2Icon } from "lucide-react";
import api from "../configs/api";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../app/Feautes/authSlice";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const query = new URLSearchParams(window.location.search);
  const urlState = query.get("state");

  const [state, setState] = React.useState(urlState || "login");
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/api/users/${state}`, formData);
      dispatch(loginAction(data));
      localStorage.setItem("token", data.token);
      toast.success(data.message);
    } catch (e) {
      console.log(e);
      toast(e?.response?.data?.message || e.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <div
      className="flex items-center justify-center min-h-screen 
                bg-linear-to-br from-gray-950 via-gray-900 to-black"
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-5 left-5 
             flex items-center gap-1
             text-gray-400 text-sm
             hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <form
        onSubmit={handleSubmit}
        className="sm:w-[380px] w-full text-center 
               bg-gray-900/80 backdrop-blur-xl
               border border-gray-700/60
               rounded-2xl px-8
               shadow-2xl shadow-black/40"
      >
        <h1 className="text-white text-3xl mt-10 font-semibold tracking-wide">
          {state === "login" ? "Welcome Back" : "Create Account"}
        </h1>

        <p className="text-gray-400 text-sm mt-2">Please {state} to continue</p>

        {/* Name */}
        {state !== "login" && (
          <div
            className="flex items-center mt-6 w-full 
                      bg-gray-800/70 
                      border border-gray-700 
                      h-12 rounded-full pl-6 gap-2
                      focus-within:ring-2 focus-within:ring-green-500"
          >
            <User2Icon size={15} className="text-green-400" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="bg-transparent w-full text-gray-200 
                     placeholder-gray-500
                     outline-none border-none"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Email */}
        <div
          className="flex items-center w-full mt-4 
                    bg-gray-800/70 
                    border border-gray-700 
                    h-12 rounded-full pl-6 gap-2
                    focus-within:ring-2 focus-within:ring-green-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </svg>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className="bg-transparent w-full text-gray-200 
                   placeholder-gray-500
                   outline-none border-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}

        <div
          className="flex items-center mt-4 w-full 
            bg-gray-800/70 
            border border-gray-700 
            h-12 rounded-full pl-6 pr-4 gap-2
            focus-within:ring-2 focus-within:ring-green-500"
        >
          {/* Lock Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-400"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>

          {/* Input */}
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="bg-transparent w-full text-gray-200 
               placeholder-gray-500
               outline-none border-none"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-white"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        {/* Forgot */}
        <div className="mt-4 text-left">
          <button
            className="text-sm text-green-400 hover:underline"
            type="reset"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full 
                 bg-linear-to-r from-green-500 to-emerald-600
                 text-white font-medium
                 hover:opacity-90 transition-all
                 shadow-lg shadow-green-500/20"
        >
          {state === "login" ? "Login" : "Sign up"}
        </button>

        {/* Switch */}
        <p
          onClick={() =>
            setState((prev) => (prev === "login" ? "register" : "login"))
          }
          className="text-gray-400 text-sm mt-4 mb-10 cursor-pointer"
        >
          {state === "login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span className="text-green-400 hover:underline">Click here</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
