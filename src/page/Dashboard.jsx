import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import StatsCard from "../components/StatsCard";
import { fetchProducts } from "../redux/slices/productSlice";
import { fetchCategories } from "../redux/slices/categorySlice";
import { fetchSuppliers } from "../redux/slices/supplierSlice";
import { fetchInventory } from "../redux/slices/invnetorySlice";
import { fetchStockMovements } from "../redux/slices/stockMovementSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products, loading: productLoading } = useSelector((state) => state.product);
  const { items: categories } = useSelector((state) => state.category);
  const { items: suppliers } = useSelector((state) => state.supplier);
  const { items: inventory } = useSelector((state) => state.inventory);
  const { items: movements } = useSelector((state) => state.stockMovement);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSuppliers());
    dispatch(fetchInventory());
    dispatch(fetchStockMovements());
  }, [dispatch]);

  const totalInventory = (inventory || []).reduce((sum, item) => {
    const quantity = Number(item.quantity ?? item.currentStock ?? item.stockQuantity ?? 0);
    return sum + quantity;
  }, 0);

  const lowStockItems = (inventory || []).filter((item) => {
    const quantity = Number(item.quantity ?? item.currentStock ?? item.stockQuantity ?? 0);
    const minimum = Number(item.minimumStock ?? item.minStock ?? item.reorderLevel ?? 0);
    return quantity <= minimum;
  });

  const recentMovements = (movements || []).slice(0, 5);

  if (productLoading && products.length === 0) {
    return <Loader label="Loading dashboard..." />;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">Inventory overview</p>
          <h1>Dashboard</h1>
        </div>
      </div>

      <div className="stats-grid">
        <StatsCard title="Total Products" value={products.length} subtitle="Across all categories" tone="default" />
        <StatsCard title="Total Categories" value={(categories || []).length} subtitle="Active groups" tone="info" />
        <StatsCard title="Total Suppliers" value={(suppliers || []).length} subtitle="Registered vendors" tone="success" />
        <StatsCard title="Total Inventory" value={totalInventory} subtitle="Units in stock" tone="warning" />
        <StatsCard title="Low Stock Items" value={lowStockItems.length} subtitle="Needs attention" tone="warning" />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Recent Stock Movements</h3>
        </div>

        {recentMovements.length === 0 ? (
          <div className="empty-state">No recent stock movement records available yet.</div>
        ) : (
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
                {recentMovements.map((movement, index) => (
                  <tr key={movement._id || movement.id || index}>
                    <td>{movement.product?.name || movement.productName || "—"}</td>
                    <td>{movement.location?.name || movement.locationName || "—"}</td>
                    <td>
                      <span className={`badge ${String(movement.type || movement.movementType || "").toLowerCase() === "out" ? "out" : "in"}`}>
                        {movement.type || movement.movementType || "IN"}
                      </span>
                    </td>
                    <td>{movement.quantity || movement.qty || 0}</td>
                    <td>{movement.date || movement.createdAt || "—"}</td>
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

export default Dashboard;