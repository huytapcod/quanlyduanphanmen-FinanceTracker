import React, { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

/**
 * Hàm trợ giúp để tạo className cho NavLink dựa trên trạng thái active
 */
const getNavLinkClass = ({ isActive }) => {
  const baseClasses =
    "font-medium hover:text-yellow-400 transition duration-150 ease-in-out px-1 pb-1";
  const activeClasses = "text-yellow-400 border-b-2 border-yellow-400";
  const inactiveClasses = "text-gray-300 dark:text-gray-400";

  return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
};

export default function Navigation() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar */}
      <nav className="bg-gray-800 dark:bg-gray-950 shadow-lg px-6 py-4 flex justify-between items-center text-white">
        {/* Links */}
        <div className="flex-1 flex-center flex space-x-10">
          <NavLink to="/" className={getNavLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/stats" className={getNavLinkClass}>
            Thống kê
          </NavLink>
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="px-3 py-2 rounded-md bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </nav>

      {/* Nội dung page */}
      <main className="p-6 min-h-[calc(100vh-160px)]">
        <Outlet />
      </main>
    </div>
  );
}
