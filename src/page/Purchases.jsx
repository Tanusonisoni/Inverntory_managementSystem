import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchPurchases } from "../redux/slices/purchaseSlice";

const Purchases = () => {
  const dispatch = useDispatch();
  const { items: purchases, loading, error } = useSelector((state) => state.purchase);

  useEffect(() => {
    dispatch(fetchPurchases());
  }, [dispatch]);

  return (
    <div>
      <div className="page-header">
        <h1>Purchases</h1>
      </div>

      <div className="panel">
        {loading && purchases.length === 0 ? <Loader label="Loading purchases..." /> : purchases.length === 0 ? <div className="empty-state">No purchases have been recorded yet.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Supplier</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase, index) => (
                  <tr key={purchase._id || purchase.id || index}>
                    <td>{purchase.reference || purchase.purchaseNo || "—"}</td>
                    <td>{purchase.supplierName || purchase.supplier?.name || "—"}</td>
                    <td>{purchase.totalAmount || purchase.amount || 0}</td>
                    <td><span className="badge success">{purchase.status || "Completed"}</span></td>
                    <td>{purchase.date || purchase.createdAt || "—"}</td>
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

export default Purchases;