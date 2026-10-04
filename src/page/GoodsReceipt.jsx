import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchGoodsReceipts } from "../redux/slices/goodsReceiptSlice";

const GoodsReceipt = () => {
  const dispatch = useDispatch();
  const { items: receipts, loading, error } = useSelector((state) => state.goodsReceipt);

  useEffect(() => {
    dispatch(fetchGoodsReceipts());
  }, [dispatch]);

  return (
    <div>
      <div className="page-header">
        <h1>Goods Receipt</h1>
      </div>

      <div className="panel">
        {loading && receipts.length === 0 ? <Loader label="Loading goods receipt..." /> : receipts.length === 0 ? <div className="empty-state">No goods receipt records available yet.</div> : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Receipt No</th>
                  <th>Supplier</th>
                  <th>Total Qty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((receipt, index) => (
                  <tr key={receipt._id || receipt.id || index}>
                    <td>{receipt.receiptNo || receipt.reference || "—"}</td>
                    <td>{receipt.supplierName || receipt.supplier || "—"}</td>
                    <td>{receipt.totalQuantity || receipt.quantity || 0}</td>
                    <td>{receipt.date || receipt.createdAt || "—"}</td>
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

export default GoodsReceipt;
