import { Routes, Route, Link } from "react-router-dom";
import Feed from "./pages/Feed.jsx";
import Creator from "./pages/Creator.jsx";
import PhotoDetail from "./pages/PhotoDetail.jsx";

export default function App() {
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16, fontFamily: "system-ui" }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0, flex: 1 }}>COM769 Media</h2>
        <Link to="/">Consumer</Link>
        <Link to="/creator">Creator</Link>
      </header>

      <Routes>
        <Route path="/" element={<Feed />} />
        <Route path="/creator" element={<Creator />} />
        <Route path="/photo/:id" element={<PhotoDetail />} />
      </Routes>
    </div>
  );
}
