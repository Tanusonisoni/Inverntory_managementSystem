import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchUsers } from "../redux/slices/userSlice";

const User = () => {
  const dispatch = useDispatch();
  const { items: users, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div>
      <div className="page-header">
        <h1>Users</h1>
      </div>

      <div className="panel">
        {loading && users.length === 0 ? <Loader label="Loading users..." /> : users.length === 0 ? <div className="empty-state">No users available yet.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id || user.id || index}>
                    <td>{user.name || "—"}</td>
                    <td>{user.email || "—"}</td>
                    <td>{user.role || "Admin"}</td>
                    <td><span className="badge success">{user.isActive === false ? "Inactive" : "Active"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {error ? <div className="error-box" style={{ marginTop: "16px" }}>{error}</div> : null}
      </div>
    </div>
  );
};

export default User;