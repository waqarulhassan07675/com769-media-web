import { useEffect, useState } from "react";
import { apiGet } from "../api";
import { Link } from "react-router-dom";

export default function Feed() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    apiGet("/photos").then(setItems).catch((e) => setErr(String(e)));
  }, []);

  return (
    <div>
      <h3>Photo Feed</h3>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
        {items.map((p) => (
          <Link key={p.id} to={`/photo/${p.id}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
              {p.imageUrl ? (
                <img src={p.imageUrl} alt={p.title} style={{ width: "100%", height: 180, objectFit: "cover" }} />
              ) : (
                <div style={{ height: 180, display: "grid", placeItems: "center", color: "#666" }}>No image</div>
              )}
              <div style={{ padding: 10 }}>
                <div style={{ fontWeight: 600 }}>{p.title}</div>
                <div style={{ fontSize: 12, color: "#666" }}>{p.creatorId}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
