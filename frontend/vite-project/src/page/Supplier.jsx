import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { createSupplier, editSupplier, fetchSuppliers, removeSupplier } from "../redux/slices/supplierSlice";

const emptyForm = { name: "", phone: "", email: "", gstNumber: "", address: "", paymentTerms: "", isActive: true };

const Supplier = () => {
  const dispatch = useDispatch();
  const { items: suppliers, loading, error } = useSelector((state) => state.supplier);
  const { user } = useSelector((state) => state.auth);
  const canManageSuppliers = user?.role === "admin";
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [pageError, setPageError] = useState("");

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const filteredSuppliers = useMemo(() => suppliers.filter((supplier) =>
    [supplier.name, supplier.email, supplier.phone, supplier.gstNumber]
      .some((value) => String(value || "").toLowerCase().includes(search.toLowerCase()))
  ), [suppliers, search]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId("");
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPageError("");
    try {
      if (editingId) {
        await dispatch(editSupplier({ id: editingId, data: form })).unwrap();
      } else {
        await dispatch(createSupplier(form)).unwrap();
      }
      await dispatch(fetchSuppliers()).unwrap();
      resetForm();
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to save supplier.");
    }
  };

  const startEdit = (supplier) => {
    setEditingId(supplier._id || supplier.id);
    setForm({
      name: supplier.name || "",
      phone: supplier.phone || "",
      email: supplier.email || "",
      gstNumber: supplier.gstNumber || "",
      address: supplier.address || "",
      paymentTerms: supplier.paymentTerms || "",
      isActive: supplier.isActive !== false,
    });
    setPageError("");
    setShowForm(true);
  };

  const handleDelete = async (supplier) => {
    if (!window.confirm(`Delete supplier ${supplier.name}?`)) return;
    setPageError("");
    try {
      await dispatch(removeSupplier(supplier._id || supplier.id)).unwrap();
      await dispatch(fetchSuppliers()).unwrap();
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to delete supplier.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><p className="eyebrow">Vendor directory</p><h1>Suppliers</h1></div>
        {canManageSuppliers && <button className="primary-button" type="button" onClick={() => { resetForm(); setShowForm(true); }}>+ Add Supplier</button>}
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="panel-header"><h3>{editingId ? "Edit Supplier" : "Add Supplier"}</h3></div>
          <div className="form-grid">
            <div className="form-field"><label htmlFor="supplier-name">Supplier name</label><input id="supplier-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></div>
            <div className="form-field"><label htmlFor="supplier-phone">Phone</label><input id="supplier-phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></div>
            <div className="form-field"><label htmlFor="supplier-email">Email</label><input id="supplier-email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></div>
            <div className="form-field"><label htmlFor="supplier-gst">GST number</label><input id="supplier-gst" value={form.gstNumber} onChange={(event) => setForm({ ...form, gstNumber: event.target.value })} /></div>
            <div className="form-field"><label htmlFor="supplier-payment">Payment terms</label><input id="supplier-payment" value={form.paymentTerms} onChange={(event) => setForm({ ...form, paymentTerms: event.target.value })} /></div>
            <div className="form-field"><label htmlFor="supplier-active">Status</label><select id="supplier-active" value={String(form.isActive)} onChange={(event) => setForm({ ...form, isActive: event.target.value === "true" })}><option value="true">Active</option><option value="false">Inactive</option></select></div>
            <div className="form-field" style={{ gridColumn: "1 / -1" }}><label htmlFor="supplier-address">Address</label><textarea id="supplier-address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} /></div>
          </div>
          {(pageError || error) && <div className="error-box" role="alert" style={{ marginTop: "16px" }}>{pageError || error}</div>}
          <div className="form-row">
            <button className="ghost-button" type="button" onClick={resetForm}>Cancel</button>
            <button className="primary-button" type="submit" disabled={loading}>{loading ? "Saving..." : editingId ? "Save Changes" : "Create Supplier"}</button>
          </div>
        </form>
      )}

      {!showForm && (pageError || error) && <div className="error-box" role="alert" style={{ marginBottom: "16px" }}>{pageError || error}</div>}
      <div className="panel" style={{ marginTop: showForm ? "20px" : 0 }}>
        <div className="form-field" style={{ maxWidth: "380px", marginBottom: "16px" }}>
          <label htmlFor="supplier-search">Search suppliers</label>
          <input id="supplier-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Name, email, phone, GST..." />
        </div>
        {loading && suppliers.length === 0 ? <Loader label="Loading suppliers..." /> : filteredSuppliers.length === 0 ? <div className="empty-state">No matching suppliers found.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>GST</th><th>Payment terms</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier._id || supplier.id}>
                    <td>{supplier.name || "—"}</td><td>{supplier.phone || "—"}</td><td>{supplier.email || "—"}</td><td>{supplier.gstNumber || "—"}</td><td>{supplier.paymentTerms || "—"}</td>
                    <td><span className={`badge ${supplier.isActive === false ? "warning" : "success"}`}>{supplier.isActive === false ? "Inactive" : "Active"}</span></td>
                    <td><div className="table-actions">
                      {canManageSuppliers && <button className="small-button" type="button" onClick={() => startEdit(supplier)}>Edit</button>}
                      {canManageSuppliers && <button className="small-button" type="button" onClick={() => handleDelete(supplier)}>Delete</button>}
                    </div></td>
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
