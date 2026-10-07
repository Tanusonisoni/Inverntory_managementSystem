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
import AIAgent from "./page/AIAgent";
import RoleRoute from "./components/RoleRoute";

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
                    <Route path="/products" element={<RoleRoute roles={["admin", "inventory", "sales"]}><Products /></RoleRoute>} />
                    <Route path="/products/add" element={<RoleRoute roles={["admin", "inventory", "sales"]}><Products /></RoleRoute>} />
                    <Route path="/products/:id" element={<RoleRoute roles={["admin", "inventory"]}><Products /></RoleRoute>} />
                    <Route path="/products/edit/:id" element={<RoleRoute roles={["admin", "inventory", "sales"]}><Products /></RoleRoute>} />
                    <Route path="/categories" element={<RoleRoute roles={["admin", "inventory"]}><Categories /></RoleRoute>} />
                    <Route path="/suppliers" element={<RoleRoute roles={["admin", "purchase"]}><Supplier /></RoleRoute>} />
                    <Route path="/locations" element={<RoleRoute roles={["admin", "inventory"]}><Location /></RoleRoute>} />
                    <Route path="/inventory" element={<RoleRoute roles={["admin", "inventory"]}><Inventory /></RoleRoute>} />
                    <Route path="/stock-movement" element={<RoleRoute roles={["admin", "inventory", "sales"]}><StockMovement /></RoleRoute>} />
                    <Route path="/purchases" element={<RoleRoute roles={["admin", "purchase"]}><Purchases /></RoleRoute>} />
                    <Route path="/goods-receipt" element={<RoleRoute roles={["admin", "purchase"]}><GoodsReceipt /></RoleRoute>} />
                    <Route path="/users" element={<RoleRoute roles={["admin"]}><User /></RoleRoute>} />
                    <Route path="/ai-assistant" element={<RoleRoute roles={["admin", "inventory", "purchase", "sales"]}><AIAgent /></RoleRoute>} />
                </Route>


                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;