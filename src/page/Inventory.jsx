import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchInventory, createInventory } from "../redux/slices/invnetorySlice";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchLocations } from "../redux/slices/locationSlice";
import { getLowStockInventory, stockInInventory, stockOutInventory } from "../services/inventoryApi";

const initialForm = { product: "", location: "", quantity: 0, minStock: 0 };

const Inventory = () => {
  const dispatch = useDispatch();
  const { items: inventory, loading, error } = useSelector((state) => state.inventory);
  const { products } = useSelector((state) => state.product);
  const { items: locations } = useSelector((state) => state.location);
  const [form, setForm] = useState(initialForm);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showLowStock, setShowLowStock] = useState(false);
  const [lowStock, setLowStock] = useState([]);
  const [actionTarget, setActionTarget] = useState(null);
  const [actionType, setActionType] = useState("in");
  const [quantity, setQuantity] = useState("");
  const [actionError, setActionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchInventory());
    dispatch(fetchProducts());
    dispatch(fetchLocations());
  }, [dispatch]);

  const locationById = useMemo(
    () => new Map(locations.map((location) => [String(location._id || location.id), location])),
    [locations]
  );

  const productById = useMemo(
    () => new Map(products.map((product) => [String(product._id || product.id), product])),
    [products]
  );

  const rows = showLowStock ? lowStock : inventory;

  const loadLowStock = async () => {
    setActionError("");
    try {
      const result = await getLowStockInventory();
      setLowStock(result);
      setShowLowStock(true);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || "Unable to load low-stock inventory.");
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setActionError("");
    setIsSaving(true);
    try {
      await dispatch(createInventory({
        ...form,
        quantity: Number(form.quantity),
        minStock: Number(form.minStock),
      })).unwrap();
      await dispatch(fetchInventory()).unwrap();
      setForm(initialForm);
      setShowCreateForm(false);
    } catch (requestError) {
      setActionError(typeof requestError === "string" ? requestError : "Unable to create inventory record.");
    } finally {
      setIsSaving(false);
    }
  };

  const openStockAction = (item, type) => {
    setActionTarget(item);
    setActionType(type);
    setQuantity("");
    setActionError("");
  };

  const submitStockAction = async (event) => {
    event.preventDefault();
    const amount = Number(quantity);
    if (!actionTarget || !Number.isFinite(amount) || amount <= 0) return;

    setIsSaving(true);
    setActionError("");
    try {
      const id = actionTarget._id || actionTarget.id;
      if (actionType === "in") {
        await stockInInventory(id, amount);
      } else {
        await stockOutInventory(id, amount);
      }
      await dispatch(fetchInventory()).unwrap();
      setActionTarget(null);
    } catch (requestError) {
      setActionError(requestError.response?.data?.message || requestError.message || "Unable to update stock.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Stock levels</p>
          <h1>Inventory</h1>
        </div>
        <div className="page-actions">
          <button className="ghost-button" type="button" onClick={loadLowStock}>Low Stock</button>
          {showLowStock && (
            <button className="ghost-button" type="button" onClick={() => setShowLowStock(false)}>All Inventory</button>
          )}
          <button className="primary-button" type="button" onClick={() => setShowCreateForm((visible) => !visible)}>
            {showCreateForm ? "Close" : "Add Inventory"}
          </button>
        </div>
      </div>

      {showCreateForm && (
        <form className="form-card" onSubmit={handleCreate}>
          <h3>New inventory record</h3>
          <div className="form-grid" style={{ marginTop: "16px" }}>
            <div className="form-field">
              <label htmlFor="inventory-product">Product</label>
              <select id="inventory-product" value={form.product} onChange={(event) => setForm({ ...form, product: event.target.value })} required>
                <option value="">Select product</option>
                {products.map((product) => <option key={product._id || product.id} value={product._id || product.id}>{product.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="inventory-location">Location</label>
              <select id="inventory-location" value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required>
                <option value="">Select location</option>
                {locations.map((location) => <option key={location._id || location.id} value={location._id || location.id}>{location.name}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="inventory-quantity">Starting quantity</label>
              <input id="inventory-quantity" type="number" min="0" value={form.quantity} onChange={(event) => setForm({ ...form, quantity: event.target.value })} required />
            </div>
            <div className="form-field">
              <label htmlFor="inventory-min-stock">Minimum stock</label>
              <input id="inventory-min-stock" type="number" min="0" value={form.minStock} onChange={(event) => setForm({ ...form, minStock: event.target.value })} required />
            </div>
          </div>
          <div className="form-row">
            <button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : "Create Inventory"}</button>
          </div>
        </form>
      )}

      {actionTarget && (
        <form className="form-card" onSubmit={submitStockAction} style={{ marginTop: "16px" }}>
          <h3>Stock {actionType === "in" ? "In" : "Out"} · {actionTarget.product?.name || productById.get(String(actionTarget.product))?.name || "Product"}</h3>
          <div className="form-grid" style={{ marginTop: "14px" }}>
            <div className="form-field">
              <label htmlFor="stock-quantity">Quantity</label>
              <input id="stock-quantity" type="number" min="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} required autoFocus />
            </div>
          </div>
          <div className="form-row">
            <button className="ghost-button" type="button" onClick={() => setActionTarget(null)}>Cancel</button>
            <button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? "Saving..." : `Confirm Stock ${actionType === "in" ? "In" : "Out"}`}</button>
          </div>
        </form>
      )}

      {(error || actionError) && <div className="error-box" role="alert" style={{ marginTop: "16px" }}>{actionError || error}</div>}

      <div className="panel" style={{ marginTop: "20px" }}>
        {loading && inventory.length === 0 ? <Loader label="Loading inventory..." /> : rows.length === 0 ? (
          <div className="empty-state">{showLowStock ? "No low-stock products found." : "No inventory records found."}</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Product</th><th>Location</th><th>Quantity</th><th>Minimum stock</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const itemProduct = item.product?.name ? item.product : productById.get(String(item.product));
                  const itemLocation = item.location?.name ? item.location : locationById.get(String(item.location));
                  const qty = Number(item.quantity ?? 0);
                  const minimum = Number(item.minStock ?? item.minimumStock ?? 0);
                  const isLow = qty <= minimum;
                  return (
                    <tr key={item._id || item.id}>
                      <td>{itemProduct?.name || "—"}</td>
                      <td>{itemLocation?.name || "—"}</td>
                      <td>{qty}</td>
                      <td>{minimum}</td>
                      <td><span className={`badge ${isLow ? "warning" : "success"}`}>{isLow ? "Low stock" : "Healthy"}</span></td>
                      <td>
                        <div className="table-actions">
                          <button className="small-button" type="button" onClick={() => openStockAction(item, "in")}>Stock In</button>
                          <button className="small-button" type="button" onClick={() => openStockAction(item, "out")}>Stock Out</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;
