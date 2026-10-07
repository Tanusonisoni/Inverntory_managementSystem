import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { createLocation, editLocation, fetchLocations, removeLocation } from "../redux/slices/locationSlice";

const initialForm = { name: "", address: "", description: "" };

const Location = () => {
  const dispatch = useDispatch();
  const { items: locations, loading, error } = useSelector((state) => state.location);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [pageError, setPageError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchLocations());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageError("");
    try {
      if (editingId) {
        await dispatch(editLocation({ id: editingId, data: formData })).unwrap();
        setEditingId(null);
      } else {
        await dispatch(createLocation(formData)).unwrap();
      }
      await dispatch(fetchLocations()).unwrap();
      setFormData(initialForm);
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to save location.");
    }
  };

  const handleEdit = (location) => {
    setEditingId(location._id || location.id);
    setFormData({ name: location.name || "", address: location.address || "", description: location.description || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this location?")) return;
    setPageError("");
    try {
      await dispatch(removeLocation(id)).unwrap();
      await dispatch(fetchLocations()).unwrap();
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to delete location.");
    }
  };
  const visibleLocations = locations.filter((location) =>
    `${location.name || ""} ${location.address || ""} ${location.description || ""}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1>Locations</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field"><label>Name</label><input value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} required /></div>
          <div className="form-field"><label>Address</label><input value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} required /></div>
          <div className="form-field" style={{ gridColumn: "1 / -1" }}><label>Description</label><textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} /></div>
        </div>

        {error ? <div className="error-box" style={{ marginTop: "16px" }}>{error}</div> : null}

        <div className="form-row">
          {editingId ? <button className="ghost-button" type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }}>Cancel</button> : null}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Location" : "Add Location"}</button>
        </div>
      </form>

      {(pageError || error) && <div className="error-box" role="alert" style={{ marginTop: "16px" }}>{pageError || error}</div>}

      <div className="panel" style={{ marginTop: "20px" }}>
        <div className="form-field" style={{ maxWidth: "380px", marginBottom: "16px" }}><label htmlFor="location-search">Search locations</label><input id="location-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name or address..." /></div>
        {loading && locations.length === 0 ? <Loader label="Loading locations..." /> : visibleLocations.length === 0 ? <div className="empty-state">No matching locations found.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleLocations.map((location) => (
                  <tr key={location._id || location.id}>
                    <td>{location.name}</td>
                    <td>{location.address || "—"}</td>
                    <td>{location.description || "—"}</td>
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