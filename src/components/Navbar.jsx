import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const heading = user?.role === "admin" ? "Admin Dashboard" : `${user?.department || "Employee"} Workspace`;

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Overview</p>
        <h2>{heading}</h2>
      </div>

      <div className="topbar-actions">
        <div className="user-pill">
          <span className="avatar">{(user?.name || user?.email || "A").charAt(0).toUpperCase()}</span>
          <span>{user?.name || user?.email || "Admin"}</span>
        </div>
        <button className="secondary-button" type="button" onClick={() => dispatch(logout())}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
