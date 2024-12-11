import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/UserAuthentication";
import { useEffect } from "react";

function AppProtection({ children }) {
  const naviaget = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) naviaget("/");
  }, [isAuthenticated, naviaget]);

  return isAuthenticated ? children : null;
}

export default AppProtection;
