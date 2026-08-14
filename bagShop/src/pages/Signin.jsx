import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./signin.css";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { login, isLoggedIn, user } = useAuth();

  

 useEffect(() =>{
  if (isLoggedIn){
    if (user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  }
  },[isLoggedIn, navigate, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try{
      await login({
        email,
        password,
      });
    }catch(err){
      setError(err.message || "Invalid email or password.");
    }finally{
      setLoading(false);
    }
    };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign In</h2>
        <p className="auth-subtitle">Welcome back! Please enter your details.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="auth-label">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{""} <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
