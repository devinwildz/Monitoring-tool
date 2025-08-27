import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    if (user) {
        return <Navigate to="/user/dashboard" replace />;
    }
    return children;
};

export default PublicRoute;