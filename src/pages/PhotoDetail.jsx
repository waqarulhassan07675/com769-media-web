import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiGet, apiPost } from "../api";

export default function PhotoDetail() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState({ average: 0, count: 0 });
  const [creatorId, setCreatorId] = useState("waqar-1");
  const [text, setText] = useState("");
  const [myRating, setMyRating] = useState(5);
  const [err, setErr] = useState("");

  async function refresh() {
    setErr("");
    try {
      const photos = await apiGet("/photos");
      setPhoto(photos.find((p) => p.id === id) || null);

      const c = await apiGet(`/photos/${id}/comments`);
      setComments(c);

      const r = await apiGet(`/photos/${id}/ratings`);
      setRating(r);
    } catch (e) {
      setErr(String(e));
    }
  }

  useEffect(() => { refresh(); }, [id]);

  async function addComment(e) {
    e.preventDefault();
    try {
      await apiPost(`/photos/${id}/comments`, { creatorId, text });
      setText("");
      await refresh();
    } catch (e) {
      setErr(String(e));
    }
  }

  async function submitRating(e) {
    e.preventDefault();
    try {
      await apiPost(`/photos/${id}/ratings`, { creatorId, value: Number(myRating) });
      await refresh();
    } catch (e) {
      setErr(String(e));
    }
  }

  if (!photo) return <div>{err ? err : "Loading..."}</div>;

  return (
    <div>
      <h3>{photo.title}</h3>
      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {photo.imageUrl ? (
        <img src={photo.imageUrl} alt={photo.title} style={{ width: "100%", maxHeight: 520, objectFit: "contain" }} />
      ) : (
        <p>No imageUrl for this photo.</p>
      )}

      <p>{photo.description}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
        <div>
          <h4>Comments</h4>
          <form onSubmit={addComment} style={{ display: "grid", gap: 8 }}>
            <input value={creatorId} onChange={(e) => setCreatorId(e.target.value)} placeholder="creatorId" />
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="write a comment" />
            <button type="submit">Post Comment</button>
          </form>

          <ul>
            {comments.map((c) => (
              <li key={c.id}>
                <b>{c.creatorId}:</b> {c.text}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Ratings</h4>
          <p>
            Average: <b>{Number(rating.average).toFixed(2)}</b> ({rating.count} rating{rating.count === 1 ? "" : "s"})
          </p>
          <form onSubmit={submitRating} style={{ display: "grid", gap: 8 }}>
            <input value={creatorId} onChange={(e) => setCreatorId(e.target.value)} placeholder="creatorId" />
            <select value={myRating} onChange={(e) => setMyRating(e.target.value)}>
              <option value="1">1</option><option value="2">2</option><option value="3">3</option>
              <option value="4">4</option><option value="5">5</option>
            </select>
            <button type="submit">Submit Rating</button>
          </form>
        </div>
      </div>
    </div>
  );
}
