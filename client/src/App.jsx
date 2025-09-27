import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import NotFound from "./page/NotFound";
import Pagination from "./page/Pagination";
import StatsPage from "./page/StatsPage";
import Navigation from "./page/Navigation";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="pagination" element={<Pagination />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>   
  );
}
