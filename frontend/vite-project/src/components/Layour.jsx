import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";

const Layour = () => (
  <div className="app-shell">
    <Sidebar />
    <div className="main-panel">
      <Navbar />
      <main className="content-area">
        <Outlet />
      </main>
    </div>
  </div>
);

export default Layour;
