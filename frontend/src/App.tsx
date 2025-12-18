import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Settingpage from "./pages/Settingpage";
import Profilepage from "./pages/Profilepage";
import Navbar from "./component/Navbar.jsx";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import { useAuthStore } from "./store/authStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
const App: React.FC = () => {
  const location = useLocation()
  const {
    AuthUser,
    checkAuth,
    isCheckingAuth,
  } = useAuthStore();
  const { theme } = useThemeStore()
  useEffect(() => {
    checkAuth();
  }, [location, checkAuth]);
  if (isCheckingAuth && !AuthUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="size-8 text-gray-50 animate-spin" />
      </div>
    )
  }
  return (
    <div data-theme={theme}>
      <Navbar />
      <Toaster /> 
      <Routes>    
        <Route    
          path="/"
          element={AuthUser ? <Homepage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!AuthUser ? <Loginpage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!AuthUser ? <Signuppage /> : <Navigate to="/" />}
        />
        <Route path="/setting" element={<Settingpage />} />
        <Route
          path="/profile"
          element={AuthUser ? <Profilepage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};
export default App;












