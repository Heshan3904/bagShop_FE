import {Navigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isLoggedIn, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <h2>Loading...</h2>
            </div>
        );
    }


    if (!isLoggedIn) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;