import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchGoodsReceipts } from "../redux/slices/goodsReceiptSlice";
import { fetchPurchases } from "../redux/slices/purchaseSlice";
import { fetchLocations } from "../redux/slices/locationSlice";
import { addGoodsReceipt } from "../services/goodReciptsApi";

const GoodsReceipt = () => {
  const dispatch = useDispatch();
  const { items: receipts, loading, error } = useSelector((state) => state.goodsReceipt);
  const { items: purchases } = useSelector((state) => state.purchase);
  const { items: locations } = useSelector((state) => state.location);
  const [showForm, setShowForm] = useState(false);
  const [purchaseId, setPurchaseId] = useState("");
  const [locationId, setLocationId] = useState("");
  const [receiptItems, setReceiptItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    dispatch(fetchGoodsReceipts());
    dispatch(fetchPurchases());
    dispatch(fetchLocations());
  }, [dispatch]);

  const handlePurchaseChange = (id) => {
    setPurchaseId(id);
    const purchase = purchases.find((item) => String(item._id || item.id) === String(id));
    setReceiptItems((purchase?.items || []).map((item) => ({
      product: item.product?._id || item.product,
      productName: item.product?.name || "Product",
      orderedQuantity: Number(item.quantity),
      receivedQuantity: Number(item.quantity),
      acceptedQuantity: Number(item.quantity),
    })));
  };

  const updateReceiptItem = (index, field, value) => {
    setReceiptItems((current) => current.map((item, itemIndex) =>
      itemIndex === index ? { ...item, [field]: Number(value) } : item
    ));
  };

  const resetForm = () => {
    setShowForm(false);
    setPurchaseId("");
    setLocationId("");
    setReceiptItems([]);
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");
    setSuccessMessage("");
    try {
      await addGoodsReceipt({
        purchase: purchaseId,
        location: locationId,
        items: receiptItems.map(({ product, orderedQuantity, receivedQuantity, acceptedQuantity }) => ({
          product,
          orderedQuantity,
          receivedQuantity,
          acceptedQuantity,
        })),
      });
      await Promise.all([
        dispatch(fetchGoodsReceipts()).unwrap(),
        dispatch(fetchPurchases()).unwrap(),
      ]);
      setSuccessMessage("Goods receipt saved; accepted quantities were added to inventory.");
      resetForm();
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || requestError.message || "Unable to save goods receipt.");
    } finally {
      setIsSaving(false);
    }
  };

  const approvedPurchases = purchases.filter((purchase) => purchase.status === "approved");

  return (
    <div>
      <div className="page-header">
        <div><p className="eyebrow">Receiving</p><h1>Goods Receipt</h1></div>
        <button className="primary-button" type="button" onClick={() => { setShowForm((current) => !current); setSuccessMessage(""); }}>
          {showForm ? "Close" : "Receive Purchase"}
        </button>
      </div>

      {successMessage && <div className="success-box" role="status" style={{ marginBottom: "16px" }}>{successMessage}</div>}

      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Record goods received</h3>
          <div className="form-grid" style={{ marginTop: "16px" }}>
            <div className="form-field">
              <label htmlFor="receipt-purchase">Approved purchase</label>
              <select id="receipt-purchase" value={purchaseId} onChange={(event) => handlePurchaseChange(event.target.value)} required>
                <option value="">Select purchase</option>
                {approvedPurchases.map((purchase) => (
                  <option key={purchase._id || purchase.id} value={purchase._id || purchase.id}>
                    {(purchase.supplier?.name || "Supplier") + " · " + String(purchase._id || purchase.id).slice(-6)}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="receipt-location">Stock location</label>
              <select id="receipt-location" value={locationId} onChange={(event) => setLocationId(event.target.value)} required>
                <option value="">Select location</option>
                {locations.map((location) => <option key={location._id || location.id} value={location._id || location.id}>{location.name}</option>)}
              </select>
            </div>
          </div>
          {receiptItems.length > 0 && (
            <div className="table-wrap" style={{ marginTop: "18px" }}>
              <table className="data-table">
                <thead><tr><th>Product</th><th>Ordered</th><th>Received</th><th>Accepted</th></tr></thead>
                <tbody>
                  {receiptItems.map((item, index) => (
                    <tr key={`${item.product}-${index}`}>
                      <td>{item.productName}</td>
                      <td>{item.orderedQuantity}</td>
                      <td><input aria-label={`Received quantity for ${item.productName}`} type="number" min="0" max={item.orderedQuantity} value={item.receivedQuantity} onChange={(event) => updateReceiptItem(index, "receivedQuantity", event.target.value)} required /></td>
                      <td><input aria-label={`Accepted quantity for ${item.productName}`} type="number" min="0" max={item.receivedQuantity} value={item.acceptedQuantity} onChange={(event) => updateReceiptItem(index, "acceptedQuantity", event.target.value)} required /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {formError && <div className="error-box" role="alert" style={{ marginTop: "16px" }}>{formError}</div>}
          {approvedPurchases.length === 0 && <div className="empty-state" style={{ marginTop: "16px" }}>There are no approved purchases ready to receive.</div>}
          <div className="form-row">
            <button className="ghost-button" type="button" onClick={resetForm}>Cancel</button>
            <button className="primary-button" type="submit" disabled={isSaving || !purchaseId || !receiptItems.length}>{isSaving ? "Saving..." : "Save Receipt & Update Stock"}</button>
          </div>
        </form>
      )}

      {!showForm && error && <div className="error-box" role="alert" style={{ marginBottom: "16px" }}>{error}</div>}
      <div className="panel" style={{ marginTop: showForm ? "20px" : 0 }}>
        {loading && receipts.length === 0 ? <Loader label="Loading goods receipts..." /> : receipts.length === 0 ? (
          <div className="empty-state">No goods receipt records available yet.</div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead><tr><th>Purchase</th><th>Supplier</th><th>Location</th><th>Items received</th><th>Date</th></tr></thead>
              <tbody>
                {receipts.map((receipt) => (
                  <tr key={receipt._id || receipt.id}>
                    <td>{String(receipt.purchase?._id || receipt.purchase || "—").slice(-8)}</td>
                    <td>{receipt.purchase?.supplier?.name || receipt.supplierName || "—"}</td>
                    <td>{receipt.location?.name || "—"}</td>
                    <td>{receipt.items?.map((item) => `${item.product?.name || "Product"}: ${item.acceptedQuantity}`).join(", ") || "—"}</td>
                    <td>{receipt.receivedDate ? new Date(receipt.receivedDate).toLocaleString() : "—"}</td>
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

export default GoodsReceipt;
