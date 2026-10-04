import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layour from "./components/Layour";
import LoginPage from "./page/LoginPage";
import Dashboard from "./page/Dashboard";
import Products from "./page/Products";
import Categories from "./page/Categories";
import Supplier from "./page/Supplier";
import Location from "./page/Location";
import Inventory from "./page/Inventory";
import StockMovement from "./page/StockMovement";
import Purchases from "./page/Purchases";
import GoodsReceipt from "./page/GoodsReceipt";
import User from "./page/User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layour />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/add" element={<Products />} />
          <Route path="/products/:id" element={<Products />} />
          <Route path="/products/edit/:id" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/suppliers" element={<Supplier />} />
          <Route path="/locations" element={<Location />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/stock-movement" element={<StockMovement />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/goods-receipt" element={<GoodsReceipt />} />
          <Route path="/users" element={<User />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;