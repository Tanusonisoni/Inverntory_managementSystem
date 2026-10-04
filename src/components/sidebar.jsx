import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const navItems = [
    {
        to: "/dashboard",
        label: "Dashboard",
        access: ["admin", "inventory", "purchase", "sales"],
    },
    {
        to: "/products",
        label: "Products",
        access: ["admin", "inventory", "sales"],
    },
    {
        to: "/categories",
        label: "Categories",
        access: ["admin", "inventory"],
    },
    {
        to: "/suppliers",
        label: "Suppliers",
        access: ["admin", "purchase"],
    },
    {
        to: "/locations",
        label: "Locations",
        access: ["admin", "inventory"],
    },
    {
        to: "/inventory",
        label: "Inventory",
        access: ["admin", "inventory"],
    },
    {
        to: "/stock-movement",
        label: "Stock Movement",
        access: ["admin", "inventory", "sales"],
    },
    {
        to: "/purchases",
        label: "Purchases",
        access: ["admin", "purchase"],
    },
    {
        to: "/goods-receipt",
        label: "Goods Receipt",
        access: ["admin", "purchase"],
    },
    {
        to: "/users",
        label: "Users",
        access: ["admin"],
    },
];

const Sidebar = () => {
    const user = useSelector((state) => state.auth.user);

    console.log("user", user);

    const access = user?.role === "admin" ? "admin" : user?.department;
    console.log("acess", access);

    return (
        <aside className="sidebar">
            <div className="brand-box">
                <span className="brand-mark">IMS</span>

                <div>
                    <h3>Inventory</h3>
                    <small>Admin Panel</small>
                </div>
            </div>

            <nav className="sidebar-nav">
                {navItems
                    .filter((item) => item.access.includes(access))
                    .map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === "/dashboard"}
                            className={({ isActive }) =>
                                isActive ? "nav-item active" : "nav-item"
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
            </nav>
        </aside>
    );
};

export default Sidebar;