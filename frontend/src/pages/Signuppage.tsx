import React, { useState } from "react";
import { Eye, EyeOff, MessageCircle } from "lucide-react";
import { MdOutlineErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface SignUpType {
  username: string;
  email: string;
  password: string;
}

const Signuppage: React.FC = () => {
  const { signup, isSignup } = useAuthStore();
  const navigate = useNavigate();

  const [showpass, setShowpass] = useState<boolean>(false);
  const [signUpData, setSignUpData] = useState<SignUpType>({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData({ ...signUpData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!signUpData.username || !signUpData.email || !signUpData.password) {
      setError(true);
      return;
    }

    setError(false);
    signup(signUpData);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-5xl bg-white flex rounded-2xl shadow-xl overflow-hidden">

        <div className="w-full md:w-1/2 p-6 sm:p-10 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="w-full max-w-md font-medium">

            <div className="flex items-center gap-2 mb-6 text-gray-700">
              <MessageCircle style={{ color: "rgb(167,140,222)" }} />
              <span className="font-semibold text-lg">Chattify</span>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Create an account 🎉
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Please enter your details
            </p>

            {error && (
              <div className="flex items-center gap-2 mb-4 text-sm text-red-500">
                <MdOutlineErrorOutline />
                <span>Please fill all the details</span>
              </div>
            )}

            <label className="text-sm text-gray-700">Username</label>
            <input
              name="username"
              value={signUpData.username}
              onChange={handleChange}
              className="
                w-full mt-1 mb-4 px-3 py-2 rounded-lg
                border border-gray-300 bg-white text-black 
                focus:outline-none focus:ring-2
              "
              style={{ outlineColor: "rgb(167,140,222)" }}
            />

            <label className="text-sm text-gray-700">Email address</label>
            <input
              name="email"
              type="email"
              value={signUpData.email}
              onChange={handleChange}
              className="
                w-full mt-1 mb-4 px-3 py-2 rounded-lg
                border border-gray-300 bg-white text-gray-900
                focus:outline-none focus:ring-2
              "
              style={{ outlineColor: "rgb(167,140,222)" }}
            />

            <label className="text-sm text-gray-700">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showpass ? "text" : "password"}
                value={signUpData.password}
                onChange={handleChange}
                className="
                  w-full mt-1 mb-4 px-3 py-2 rounded-lg
                  border border-gray-300 bg-white text-gray-900
                  focus:outline-none focus:ring-2
                "
                style={{ outlineColor: "rgb(167,140,222)" }}
              />

              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowpass(!showpass)}
              >
                {showpass ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>

            <button
              disabled={isSignup}
              type="submit"
              className="
                w-full py-2 mt-2 rounded-lg font-semibold text-white
                transition disabled:opacity-60
              "
              style={{
                backgroundColor: "rgb(167,140,222)",
              }}
            >
              {isSignup ? "Creating account..." : "Sign up"}
            </button>

            <p className="text-center mt-5 text-sm text-gray-600">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="font-medium cursor-pointer hover:underline"
                style={{ color: "rgb(167,140,222)" }}
              >
                Login
              </span>
            </p>
          </form>
        </div>

        <div className="hidden md:block md:w-1/2">
          <img src="/signupimg.png" className="w-full h-full object-contain" />
        </div>

      </div>
    </div>
  );
};

export default Signuppage;
