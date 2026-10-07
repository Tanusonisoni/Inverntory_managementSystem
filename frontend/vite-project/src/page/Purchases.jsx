import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { approvePurchase, createPurchase, fetchPurchases } from "../redux/slices/purchaseSlice";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchSuppliers } from "../redux/slices/supplierSlice";
import { cancelPurchase } from "../services/purchaseApi";

const newItem = () => ({ product: "", quantity: "", purchasePrice: "" });

const Purchases = () => {
  const dispatch = useDispatch();
  const { items: purchases, loading, error } = useSelector((state) => state.purchase);
  const { items: suppliers } = useSelector((state) => state.supplier);
  const { products } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [supplierId, setSupplierId] = useState("");
  const [items, setItems] = useState([newItem()]);
  const [search, setSearch] = useState("");
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [pageError, setPageError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    dispatch(fetchPurchases());
    dispatch(fetchSuppliers());
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredPurchases = useMemo(() => purchases.filter((purchase) => {
    const name = purchase.supplier?.name || "";
    return `${name} ${purchase.status || ""} ${purchase._id || ""}`.toLowerCase().includes(search.toLowerCase());
  }), [purchases, search]);

  const updateItem = (index, field, value) => {
    setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item));
  };

  const resetForm = () => {
    setShowForm(false);
    setSupplierId("");
    setItems([newItem()]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setPageError("");
    try {
      await dispatch(createPurchase({
        supplier: supplierId,
        items: items.map((item) => ({
          product: item.product,
          quantity: Number(item.quantity),
          purchasePrice: Number(item.purchasePrice),
        })),
      })).unwrap();
      await dispatch(fetchPurchases()).unwrap();
      resetForm();
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to create purchase.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async (id) => {
    setPageError("");
    try {
      await dispatch(approvePurchase(id)).unwrap();
      await dispatch(fetchPurchases()).unwrap();
    } catch (requestError) {
      setPageError(typeof requestError === "string" ? requestError : "Unable to approve purchase.");
    }
  };

  const handleCancel = async (purchase) => {
    if (!window.confirm("Cancel this purchase order?")) return;
    setPageError("");
    try {
      await cancelPurchase(purchase._id || purchase.id);
      await dispatch(fetchPurchases()).unwrap();
    } catch (requestError) {
      setPageError(requestError.response?.data?.message || requestError.message || "Unable to cancel purchase.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div><p className="eyebrow">Supplier orders</p><h1>Purchases</h1></div>
        <button className="primary-button" type="button" onClick={() => { setShowForm((visible) => !visible); setPageError(""); }}>
          {showForm ? "Close" : "+ Add Purchase"}
        </button>
      </div>

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="panel-header"><h3>Create purchase request</h3></div>
          <div className="form-field" style={{ maxWidth: "480px" }}>
            <label htmlFor="purchase-supplier">Supplier</label>
            <select id="purchase-supplier" value={supplierId} onChange={(event) => setSupplierId(event.target.value)} required>
              <option value="">Select supplier</option>
              {suppliers.filter((supplier) => supplier.isActive !== false).map((supplier) => <option key={supplier._id || supplier.id} value={supplier._id || supplier.id}>{supplier.name}</option>)}
            </select>
          </div>
          <div className="table-wrap" style={{ marginTop: "16px" }}>
            <table className="data-table">
              <thead><tr><th>Product</th><th>Quantity</th><th>Purchase price</th><th>Action</th></tr></thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td><select aria-label="Product" value={item.product} onChange={(event) => updateItem(index, "product", event.target.value)} required><option value="">Select product</option>{products.filter((product) => product.isActive !== false).map((product) => <option key={product._id || product.id} value={product._id || product.id}>{product.name} · {product.sku}</option>)}</select></td>
                    <td><input aria-label="Quantity" type="number" min="1" value={item.quantity} onChange={(event) => updateItem(index, "quantity", event.target.value)} required /></td>
                    <td><input aria-label="Purchase price" type="number" min="0" step="0.01" value={item.purchasePrice} onChange={(event) => updateItem(index, "purchasePrice", event.target.value)} required /></td>
                    <td><button className="small-button" type="button" disabled={items.length === 1} onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="page-actions" style={{ marginTop: "14px" }}>
            <button className="ghost-button" type="button" onClick={() => setItems((current) => [...current, newItem()])}>+ Add Item</button>
          </div>
          {pageError && <div className="error-box" role="alert" style={{ marginTop: "14px" }}>{pageError}</div>}
          <div className="form-row">
            <button className="ghost-button" type="button" onClick={resetForm}>Cancel</button>
            <button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? "Submitting..." : "Submit Purchase"}</button>
          </div>
        </form>
      )}

      {!showForm && (pageError || error) && <div className="error-box" role="alert" style={{ marginBottom: "16px" }}>{pageError || error}</div>}
      <div className="panel" style={{ marginTop: showForm ? "20px" : 0 }}>
        <div className="form-field" style={{ maxWidth: "380px", marginBottom: "16px" }}>
          <label htmlFor="purchase-search">Search purchases</label>
          <input id="purchase-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Supplier, status, reference..." />
        </div>
        {loading && purchases.length === 0 ? <Loader label="Loading purchases..." /> : filteredPurchases.length === 0 ? <div className="empty-state">No matching purchase orders found.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Purchase</th><th>Supplier</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredPurchases.map((purchase) => {
                  const total = (purchase.items || []).reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.purchasePrice || 0), 0);
                  return (
                    <tr key={purchase._id || purchase.id}>
                      <td>{String(purchase._id || purchase.id).slice(-8)}</td>
                      <td>{purchase.supplier?.name || "—"}</td>
                      <td>{purchase.items?.length || 0}</td>
                      <td>{total.toFixed(2)}</td>
                      <td><span className={`badge ${purchase.status === "pending" ? "warning" : purchase.status === "cancelled" ? "out" : "success"}`}>{purchase.status || "—"}</span></td>
                      <td>{purchase.orderDate ? new Date(purchase.orderDate).toLocaleDateString() : "—"}</td>
                      <td><div className="table-actions">
                        <button className="small-button" type="button" onClick={() => setSelectedPurchase(selectedPurchase?._id === purchase._id ? null : purchase)}>Details</button>
                        {isAdmin && purchase.status === "pending" && <button className="small-button" type="button" onClick={() => handleApprove(purchase._id || purchase.id)}>Approve</button>}
                        {["pending", "approved"].includes(purchase.status) && <button className="small-button" type="button" onClick={() => handleCancel(purchase)}>Cancel</button>}
                      </div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedPurchase && (
        <div className="panel" style={{ marginTop: "20px" }}>
          <div className="panel-header"><h3>Purchase details</h3><button className="ghost-button" type="button" onClick={() => setSelectedPurchase(null)}>Close</button></div>
          <p><strong>Supplier:</strong> {selectedPurchase.supplier?.name || "—"} · <strong>Status:</strong> {selectedPurchase.status}</p>
          <div className="table-wrap" style={{ marginTop: "12px" }}>
            <table className="data-table">
              <thead><tr><th>Product</th><th>Quantity</th><th>Unit price</th><th>Line total</th></tr></thead>
              <tbody>{(selectedPurchase.items || []).map((item, index) => {
                const productId = item.product?._id || item.product;
                const productName = item.product?.name || products.find((product) => String(product._id || product.id) === String(productId))?.name;
                return <tr key={item._id || index}><td>{productName || "—"}</td><td>{item.quantity}</td><td>{item.purchasePrice}</td><td>{Number(item.quantity || 0) * Number(item.purchasePrice || 0)}</td></tr>;
              })}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Purchases;
