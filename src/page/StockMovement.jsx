import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchStockMovements } from "../redux/slices/stockMovementSlice";

const StockMovement = () => {
  const dispatch = useDispatch();
  const { items: movements, loading, error } = useSelector((state) => state.stockMovement);

  useEffect(() => {
    dispatch(fetchStockMovements());
  }, [dispatch]);

  return (
    <div>
      <div className="page-header">
        <h1>Stock Movement</h1>
      </div>

      <div className="panel">
        {loading && movements.length === 0 ? <Loader label="Loading stock movements..." /> : movements.length === 0 ? <div className="empty-state">No stock movements found.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Location</th>
                  <th>Type</th>
                  <th>Quantity</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement, index) => (
                  <tr key={movement._id || movement.id || index}>
                    <td>{movement.product?.name || movement.productName || "—"}</td>
                    <td>{movement.location?.name || movement.locationName || "—"}</td>
                    <td><span className={`badge ${String(movement.type || movement.movementType || "").toLowerCase() === "out" ? "out" : "in"}`}>{movement.type || movement.movementType || "IN"}</span></td>
                    <td>{movement.quantity || movement.qty || 0}</td>
                    <td>{movement.date || movement.createdAt || "—"}</td>
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

export default StockMovement;