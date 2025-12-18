import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface LoginDataType {
  email: string;
  password: string;
}

const Loginpage: React.FC = () => {
  const { login, isLoginIn } = useAuthStore();
  const navigate = useNavigate();

  const [showpass, setShowpass] = useState<boolean>(false);
  const [loginData, setLoginData] = useState<LoginDataType>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      setError(true);
      return;
    }

    setError(false);
    login(loginData);
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-5xl flex bg-white shadow-xl rounded-2xl overflow-hidden">

        <div className="hidden md:block md:w-1/2">
          <img
            src="/loginimg.jpeg"
            alt="login"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full md:w-1/2 px-6 sm:px-12 py-10 flex items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">

            <div className="flex items-center gap-2 mb-6">
              <img
                src="https://thumbs.dreamstime.com/b/chat-icon-isolated-white-background-79426494.jpg"
                className="w-10"
              />
              <span className="text-gray-800 font-semibold text-lg">
                Chattify
              </span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back 👋
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Please enter your details to continue
            </p>

            {error && (
              <div className="flex items-center gap-2 text-red-500 mb-4 text-sm">
                <MdOutlineErrorOutline />
                <span>Please fill all the details</span>
              </div>
            )}

            <label className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              placeholder="Email"
              onChange={handleChange}
              className="w-full mt-1 mb-4 px-3 bg-slate-50 text-black py-2 border focus:bg-white border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />

            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showpass ? "text" : "password"}
                name="password"
                value={loginData.password}
                placeholder="Password"
                onChange={handleChange}
                className="w-full mt-1 mb-4 px-3 bg-slate-50 text-black py-2 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <span
                className="absolute right-3 top-6 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowpass(!showpass)}
              >
                {showpass ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoginIn}
              className="
                w-full py-2 rounded-lg font-semibold
                bg-yellow-400 text-gray-900
                hover:bg-yellow-500 transition
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {isLoginIn ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-600 mt-5">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-yellow-500 font-medium cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
