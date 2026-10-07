import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import { login } from "../redux/slices/authSlice";

const initialForm = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState(initialForm);


  useEffect(() => {

    
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(login(formData));
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-header">
          <span className="badge-soft">IMS</span>

          <h1>Inventory Management System</h1>

          <p>Sign in to continue to the dashboard.</p>
          {new URLSearchParams(location.search).get("session") === "expired" && (
            <div className="error-box" role="alert" style={{ marginTop: "14px" }}>
              Your session expired or the access token was rejected. Please sign in again.
            </div>
          )}
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>

          <div className="form-field">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              placeholder="admin@example.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              placeholder="Enter password"
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div className="error-box">
              {typeof error === "string" ? error : "Login failed"}
            </div>
          )}

          <button
            className="primary-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

        </form>

       
      </div>
    </div>
  );
};

export default LoginPage;