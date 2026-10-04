import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { createSupplier, editSupplier, fetchSuppliers, removeSupplier } from "../redux/slices/supplierSlice";

const initialForm = {
  supplierName: "",
  contactPerson: "",
  phone: "",
  email: "",
  address: "",
};

const Supplier = () => {
  const dispatch = useDispatch();
  const { items: suppliers, loading, error } = useSelector((state) => state.supplier);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (editingId) {
      await dispatch(editSupplier({ id: editingId, data: formData })).unwrap();
      setEditingId(null);
    } else {
      await dispatch(createSupplier(formData)).unwrap();
    }
    setFormData(initialForm);
  };

  const handleEdit = (supplier) => {
    setEditingId(supplier._id || supplier.id);
    setFormData({
      supplierName: supplier.supplierName || supplier.name || "",
      contactPerson: supplier.contactPerson || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      address: supplier.address || "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this supplier?")) {
      await dispatch(removeSupplier(id)).unwrap();
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Suppliers</h1>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field"><label>Supplier Name</label><input value={formData.supplierName} onChange={(event) => setFormData({ ...formData, supplierName: event.target.value })} required /></div>
          <div className="form-field"><label>Contact Person</label><input value={formData.contactPerson} onChange={(event) => setFormData({ ...formData, contactPerson: event.target.value })} /></div>
          <div className="form-field"><label>Phone</label><input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} /></div>
          <div className="form-field"><label>Email</label><input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} /></div>
          <div className="form-field" style={{ gridColumn: "1 / -1" }}><label>Address</label><input value={formData.address} onChange={(event) => setFormData({ ...formData, address: event.target.value })} /></div>
        </div>

        {error ? <div className="error-box" style={{ marginTop: "16px" }}>{error}</div> : null}

        <div className="form-row">
          {editingId ? <button className="ghost-button" type="button" onClick={() => { setEditingId(null); setFormData(initialForm); }}>Cancel</button> : null}
          <button className="primary-button" type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Update Supplier" : "Add Supplier"}</button>
        </div>
      </form>

      <div className="panel" style={{ marginTop: "20px" }}>
        {loading && suppliers.length === 0 ? <Loader label="Loading suppliers..." /> : suppliers.length === 0 ? <div className="empty-state">No suppliers added yet.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr key={supplier._id || supplier.id}>
                    <td>{supplier.supplierName || supplier.name || "—"}</td>
                    <td>{supplier.contactPerson || "—"}</td>
                    <td>{supplier.phone || "—"}</td>
                    <td>{supplier.email || "—"}</td>
                    <td>
                      <div className="table-actions">
                        <button className="small-button" type="button" onClick={() => handleEdit(supplier)}>Edit</button>
                        <button className="small-button" type="button" onClick={() => handleDelete(supplier._id || supplier.id)}>Delete</button>
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

export default Supplier;