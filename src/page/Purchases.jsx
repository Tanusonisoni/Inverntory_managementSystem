import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { fetchPurchases, createPurchase, approvePurchase } from "../redux/slices/purchaseSlice";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchSuppliers } from "../redux/slices/supplierSlice";


const Purchases = () => {
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(""); const [items, setItems] = useState([
        {
            product: "",
            quantity: "",
            purchasePrice: "",
        },
    ]);

    const { items: purchases, loading, error } = useSelector(
        (state) => state.purchase
    );
    const { items: suppliers } = useSelector((state) => state.supplier);
    const { products } = useSelector((state) => state.product);

    useEffect(() => {
        dispatch(fetchPurchases());
        dispatch(fetchSuppliers());
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const purchaseData = {
            supplier: selectedSupplier,
            items: items.map((item) => ({
                product: item.product,
                quantity: Number(item.quantity),
                purchasePrice: Number(item.purchasePrice),
            })),
        };

        console.log("Purchase Data:", purchaseData);

        const result = await dispatch(createPurchase(purchaseData));

        if (createPurchase.fulfilled.match(result)) {
            setShowForm(false);

            setSelectedSupplier("");

            setItems([
                {
                    product: "",
                    quantity: "",
                    purchasePrice: "",
                },
            ]);

            dispatch(fetchPurchases());
        }
    };

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Purchases</h1>
                </div>

                <button className="btn-primary"
                    onClick={() => setShowForm(true)}>
                    Add Purchase
                </button>
            </div>

            {showForm && (
                <form
                    className="panel"
                    onSubmit={handleSubmit}
                >
                    <h2>Add Purchase</h2>

                    <label>Supplier</label>

                    <select
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        required
                    >
                        <option value="">Select Supplier</option>

                        {suppliers.map((supplier) => (
                            <option key={supplier._id} value={supplier._id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>

                    <h3>Items</h3>

                    {items.map((item, index) => (
                        <div key={index} className="purchase-item">

                            <div>
                                <label>Product</label>

                                <select
                                    value={item.product}
                                    onChange={(e) => {
                                        const updatedItems = [...items];

                                        updatedItems[index].product = e.target.value;

                                        setItems(updatedItems);
                                    }}
                                    required
                                >
                                    <option value="">Select Product</option>

                                    {products.map((product) => (
                                        <option
                                            key={product._id}
                                            value={product._id}
                                        >
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Quantity</label>

                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const updatedItems = [...items];

                                        updatedItems[index].quantity = e.target.value;

                                        setItems(updatedItems);
                                    }}
                                    required
                                />
                            </div>

                            <div>
                                <label>Purchase Price</label>

                                <input
                                    type="number"
                                    min="0"
                                    value={item.purchasePrice}
                                    onChange={(e) => {
                                        const updatedItems = [...items];

                                        updatedItems[index].purchasePrice = e.target.value;

                                        setItems(updatedItems);
                                    }}
                                    required
                                />
                            </div>

                        </div>
                    ))}

                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                            setItems([
                                ...items,
                                {
                                    product: "",
                                    quantity: "",
                                    purchasePrice: "",
                                },
                            ])
                        }
                    >
                        + Add Item
                    </button>

                    <button
                        type="submit"
                        className="btn-primary"
                    >
                        Save Purchase
                    </button>
                </form>
            )}

            <div className="panel">
                {loading && purchases.length === 0 ? <Loader label="Loading purchases..." /> : purchases.length === 0 ? <div className="empty-state">No purchases have been recorded yet.</div> : (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Supplier</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            {purchases.map((purchase, index) => (
                                <tr key={purchase._id || index}>

                                    <td>
                                        {purchase.supplier?.name || "—"}
                                    </td>

                                    <td>
                                        {purchase.items?.reduce(
                                            (total, item) =>
                                                total + (item.quantity * item.purchasePrice),
                                            0
                                        )}
                                    </td>

                                    <td>
                                        <span className="badge success">
                                            {purchase.status}
                                        </span>
                                    </td>

                                    <td>
                                        {purchase.orderDate
                                            ? new Date(purchase.orderDate).toLocaleDateString()
                                            : "—"}
                                    </td>

                                    <td>
                                        {purchase.status === "pending" && (
                                            <button
                                                className="btn-primary"
                                                onClick={async () => {
                                                    const result = await dispatch(
                                                        approvePurchase(purchase._id)
                                                    );

                                                    if (approvePurchase.fulfilled.match(result)) {
                                                        dispatch(fetchPurchases());
                                                    }
                                                }}
                                            >
                                                Approve
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </table>
                    </div>
                )}

                {error ? <div className="error-box" style={{ marginTop: "16px" }}>{error}</div> : null}
            </div>
        </div>
    );
};

export default Purchases;