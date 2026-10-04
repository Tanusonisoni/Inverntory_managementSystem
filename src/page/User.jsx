import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchUsers, createUser, fetchUserById } from "../redux/slices/userSlice";


const User = () => {
    const dispatch = useDispatch();

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        address: "",
        password: "",
        department: ""
    })
    const { items: users, loading, error, selectedUser } = useSelector((state) => state.user);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((current) => (
            {
                ...current, [name]: value,
            })
        )
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        const result = await dispatch(createUser(formData));

        // const result = await dispatch(createUser(formData));
        if (createUser.fulfilled.match(result)) {
            setShowForm(false);

            setFormData({
                name: "",
                email: "",
                phone: "",
                gender: "",
                address: "",
                password: "",
                department: ""
            });
            dispatch(fetchUsers());
        }
    }
    useEffect(() => {
        dispatch(fetchUsers());


    }, [dispatch])

    function handelClick(id) {

        console.log(dispatch(fetchUserById(id)))
    }

    return (
        <div>
            <div className="page-header">
                <h1>Users</h1>

                <button
                    className="primary-button"
                    onClick={() => setShowForm(true)}>+Add User</button>
            </div>

            {showForm && (
                <form className="panel form-grid" onSubmit={handleSubmit}>

                    <h2>Add User</h2>

                    <div className="form-field">
                        <label>Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Phone</label>
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Gender</label>

                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Address</label>
                        <input
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label>Department</label>

                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select department</option>
                            <option value="inventory">Inventory</option>
                            <option value="purchase">Purchase</option>
                            <option value="sales">Sales</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <button type="submit" className="primary-button">
                            Create User
                        </button>

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>
                    </div>

                </form>
            )}

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
                                        <button
                                            className="secondary-button"
                                            onClick={()=>handelClick(user._id)}
                                        >
                                            View
                                        </button>
                                    </tr>
                                ))}

                            </tbody>
                        </table>

                        {selectedUser && (
                            <div className="panel" style={{ marginTop: "20px" }}>
                                <h2>User Details</h2>

                                <p><strong>Name:</strong> {selectedUser.name || "—"}</p>
                                <p><strong>Email:</strong> {selectedUser.email || "—"}</p>
                                <p><strong>Phone:</strong> {selectedUser.phone || "—"}</p>
                                <p><strong>Gender:</strong> {selectedUser.gender || "—"}</p>
                                <p><strong>Address:</strong> {selectedUser.address || "—"}</p>
                                <p><strong>Department:</strong> {selectedUser.department || "—"}</p>
                                <p><strong>Role:</strong> {selectedUser.role || "—"}</p>
                                <p><strong>Status:</strong> {selectedUser.status || "—"}</p>
                                <p>
                                    <strong>Active:</strong>{" "}
                                    {selectedUser.isActive ? "Yes" : "No"}
                                </p>
                                <p><strong>Created:</strong> {selectedUser.createdAt || "—"}</p>
                                <p><strong>Updated:</strong> {selectedUser.updatedAt || "—"}</p>
                            </div>
                        )}
                    </div>
                )}


                {error ? <div className="error-box" style={{ marginTop: "16px" }}>{error}</div> : null}
            </div>
        </div>
    );
};

export default User;