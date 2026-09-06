import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Settingpage from "./pages/Settingpage";
import Profilepage from "./pages/Profilepage";
import Navbar from "./component/Navbar.jsx";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";
import { useAuthStore } from "./store/authStore";
import { useServerStore } from "./store/useServerStore";
import ServerWakeUpModal from "./component/ServerWakeUpModal";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";

const App: React.FC = () => {
  const location = useLocation();
  const {
    AuthUser,
    checkAuth,
    isCheckingAuth,
  } = useAuthStore();
  const { theme } = useThemeStore();
  const { isServerAwake, shouldShowModal, wakeUpServer } = useServerStore();

  useEffect(() => {
    // Initiate wake-up probe as soon as frontend mounts
    wakeUpServer().then((awake) => {
      if (awake) {
        checkAuth();
      }
    });
  }, [wakeUpServer, checkAuth]);

  // Show interactive wake-up experience while Render server is undergoing cold start
  if (!isServerAwake) {
    if (shouldShowModal) {
      return (
        <div data-theme={theme} className="min-h-screen bg-base-100">
          <ServerWakeUpModal />
        </div>
      );
    }
    return (
      <div data-theme={theme} className="flex h-screen items-center justify-center bg-base-100">
        <Loader className="size-8 text-primary animate-spin" />
      </div>
    );
  }

  // After server is confirmed alive, show loader if verifying user auth
  if (isCheckingAuth && !AuthUser) {
    return (
      <div data-theme={theme} className="flex h-screen items-center justify-center bg-base-100">
        <Loader className="size-8 text-primary animate-spin" />
      </div>
    );
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












