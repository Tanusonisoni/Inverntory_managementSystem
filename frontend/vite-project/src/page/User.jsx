import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { clearSelectedUser, createUser, editUser, fetchUserById, fetchUsers, removeUser } from "../redux/slices/userSlice";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  gender: "",
  address: "",
  password: "",
  department: "",
  role: "user",
  isActive: true,
};

const User = () => {
  const dispatch = useDispatch();
  const { items: users, loading, error, selectedUser } = useSelector((state) => state.user);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = useMemo(() => users.filter((user) =>
    [user.name, user.email, user.department, user.role]
      .some((value) => String(value || "").toLowerCase().includes(search.toLowerCase()))
  ), [users, search]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageError("");
    const editableFields = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      gender: form.gender,
      address: form.address,
      department: form.department,
      role: form.role,
      isActive: form.isActive,
    };
    try {
      if (editingId) {
        await dispatch(editUser({ id: editingId, data: editableFields })).unwrap();
      } else {
        await dispatch(createUser({
          name: form.name,
          email: form.email,
          phone: form.phone,
          gender: form.gender,
          address: form.address,
          password: form.password,
          department: form.department,
        })).unwrap();
      }
      await dispatch(fetchUsers()).unwrap();
      resetForm();
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to save user.");
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id || user.id);
    setForm({
      ...emptyForm,
      ...user,
      password: "",
      department: user.department || "",
      role: user.role || "user",
      isActive: user.isActive !== false,
    });
    setPageError("");
    setShowForm(true);
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Deactivate ${user.name || user.email}?`)) return;
    setPageError("");
    try {
      await dispatch(removeUser(user._id || user.id)).unwrap();
      await dispatch(fetchUsers()).unwrap();
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to deactivate user.");
    }
  };

  const handleView = async (id) => {
    setPageError("");
    try {
      await dispatch(fetchUserById(id)).unwrap();
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to load user details.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><p className="eyebrow">Access management</p><h1>Users</h1></div>
        <button className="primary-button" type="button" onClick={() => { resetForm(); setShowForm(true); }}>+ Add User</button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="panel-header"><h3>{editingId ? "Edit User" : "Register User"}</h3></div>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="user-name">Name</label><input id="user-name" name="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div>
            <div className="form-field"><label htmlFor="user-email">Email</label><input id="user-email" name="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></div>
            <div className="form-field"><label htmlFor="user-phone">Phone</label><input id="user-phone" name="phone" value={form.phone || ""} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></div>
            <div className="form-field"><label htmlFor="user-gender">Gender</label><select id="user-gender" name="gender" value={form.gender || ""} onChange={(event) => setForm({ ...form, gender: event.target.value })} required><option value="">Select gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
            <div className="form-field"><label htmlFor="user-department">Department</label><select id="user-department" name="department" value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required><option value="">Select department</option><option value="inventory">Inventory</option><option value="purchase">Purchase</option><option value="sales">Sales</option></select></div>
            {editingId ? <div className="form-field"><label htmlFor="user-role">Role</label><select id="user-role" name="role" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><option value="user">User</option><option value="admin">Admin</option></select></div> : null}
            <div className="form-field"><label htmlFor="user-address">Address</label><input id="user-address" name="address" value={form.address || ""} onChange={(event) => setForm({ ...form, address: event.target.value })} required /></div>
            {!editingId && <div className="form-field"><label htmlFor="user-password">Password</label><input id="user-password" name="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></div>}
            {editingId && <div className="form-field"><label htmlFor="user-active">Status</label><select id="user-active" value={String(form.isActive)} onChange={(event) => setForm({ ...form, isActive: event.target.value === "true" })}><option value="true">Active</option><option value="false">Inactive</option></select></div>}
          </div>
          {(pageError || error) && <div className="error-box" role="alert" style={{ marginTop: "16px" }}>{pageError || error}</div>}
          <div className="form-row">
            <button className="ghost-button" type="button" onClick={resetForm}>Cancel</button>
            <button className="primary-button" type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Save Changes" : "Create User"}</button>
          </div>
        </form>
      )}

      {!showForm && (pageError || error) && <div className="error-box" role="alert" style={{ marginBottom: "16px" }}>{pageError || error}</div>}
      <div className="panel" style={{ marginTop: showForm ? "20px" : 0 }}>
        <div className="form-field" style={{ maxWidth: "380px", marginBottom: "16px" }}>
          <label htmlFor="user-search">Search users</label>
          <input id="user-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, role, department..." />
        </div>
        {loading && users.length === 0 ? <Loader label="Loading users..." /> : filteredUsers.length === 0 ? <div className="empty-state">No matching users found.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Department</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id || user.id}>
                    <td>{user.name || "—"}</td>
                    <td>{user.email || "—"}</td>
                    <td>{user.role || "user"}</td>
                    <td>{user.department || "—"}</td>
                    <td><span className={`badge ${user.isActive === false ? "warning" : "success"}`}>{user.isActive === false ? "Inactive" : "Active"}</span></td>
                    <td><div className="table-actions">
                      <button className="small-button" type="button" onClick={() => handleView(user._id || user.id)}>View</button>
                      <button className="small-button" type="button" onClick={() => startEdit(user)}>Edit</button>
                      <button className="small-button" type="button" onClick={() => handleDelete(user)}>Deactivate</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="panel" style={{ marginTop: "20px" }}>
          <div className="panel-header"><h3>User Details</h3><button className="ghost-button" type="button" onClick={() => dispatch(clearSelectedUser())}>Close</button></div>
          <div className="detail-grid">
            {["name", "email", "phone", "gender", "department", "role", "address"].map((field) => (
              <div className="detail-box" key={field}><span>{field}</span><strong>{selectedUser[field] || "—"}</strong></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
