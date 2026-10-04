import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { createLocation, editLocation, fetchLocations, removeLocation } from "../redux/slices/locationSlice";

const initialForm = { name: "", code: "", address: "" };

const Location = () => {
  const dispatch = useDispatch();
  const { items: locations, loading, error } = useSelector((state) => state.location);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId) {
      await dispatch(editLocation({ id: editingId, data: formData })).unwrap();
      setEditingId(null);
    } else {
      await dispatch(createLocation(formData)).unwrap();
    }
    setFormData(initialForm);
  };

  const handleEdit = (location) => {
    setEditingId(location._id || location.id);
    setFormData({ name: location.name || "", code: location.code || "", address: location.address || "" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this location?")) {
      await dispatch(removeLocation(id)).unwrap();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Locations</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field"><label>Name</label><input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required /></div>
          <div className="form-field"><label>Code</label><input value={formData.code} onChange={(event) => setFormData({ ...formData, code: event.target.value })} /></div>
          <div className="form-field" style={{ gridColumn: "1 / -1" }}><label>Address</label><input value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} /></div>
        </div>

        {error ? <div className="error-box" style={{ marginTop: "16px" }}>{error}</div> : null}

        <div className="form-row">
          {editingId ? <button className="ghost-button" type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }}>Cancel</button> : null}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Location" : "Add Location"}</button>
        </div>
      </form>

      <div className="panel" style={{ marginTop: "20px" }}>
        {loading && locations.length === 0 ? <Loader label="Loading locations..." /> : locations.length === 0 ? <div className="empty-state">No locations configured yet.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Code</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => (
                  <tr key={location._id || location.id}>
                    <td>{location.name}</td>
                    <td>{location.code || "—"}</td>
                    <td>{location.address || "—"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="small-button" type="button" onClick={() => handleEdit(location)}>Edit</button>
                        <button className="small-button" type="button" onClick={() => handleDelete(location._id || location.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Location;