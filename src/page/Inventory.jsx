import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchInventory } from "../redux/slices/invnetorySlice";

const Inventory = () => {
  const dispatch = useDispatch();
  const { items: inventory, loading, error } = useSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  return (
    <div>
      <div className="page-header">
        <h1>Inventory</h1>
      </div>

      <div className="panel">
        {loading && inventory.length === 0 ? <Loader label="Loading inventory..." /> : inventory.length === 0 ? <div className="empty-state">No inventory records found.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Location</th>
                  <th>Quantity</th>
                  <th>Minimum Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => {
                  const qty = Number(item.quantity ?? item.currentStock ?? item.stockQuantity ?? 0);
                  const min = Number(item.minimumStock ?? item.minStock ?? item.reorderLevel ?? 0);
                  const status = qty <= min ? "Low Stock" : "Healthy";

                  return (
                    <tr key={item._id || item.id}>
                      <td>{item.product?.name || item.productName || "—"}</td>
                      <td>{item.location?.name || item.locationName || "—"}</td>
                      <td>{qty}</td>
                      <td>{min}</td>
                      <td><span className={`badge ${status === "Low Stock" ? "warning" : "success"}`}>{status}</span></td>
                      <td>
                        <div className="table-actions">
                          <button className="small-button" type="button">Stock In</button>
                          <button className="small-button" type="button">Stock Out</button>
                          <button className="small-button" type="button">View</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {error ? <div className="error-box" style={{ marginTop: "16px" }}>{error}</div> : null}
      </div>
    </div>
  );
};

export default Inventory;