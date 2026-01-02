import { useState } from "react";
import { apiPost, putToSas } from "../api";

export default function Creator() {
  const [creatorId, setCreatorId] = useState("waqar-1");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("coursework,azure");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    setStatus("");

    if (!file) return setStatus("Select an image file first.");
    if (!creatorId || !title) return setStatus("creatorId and title are required.");

    try {
      const extension = (file.name.split(".").pop() || "jpg").toLowerCase();
      const uploadInfo = await apiPost("/photos/upload-url", {
        extension,
        contentType: file.type || "image/jpeg"
      });

      await putToSas(uploadInfo.uploadUrl, file);

      const doc = await apiPost("/photos", {
        creatorId,
        title,
        description,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        blobName: uploadInfo.blobName
      });

      setStatus(`Created photo: ${doc.id}`);
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (err) {
      setStatus(String(err));
    }
  }

  return (
    <div>
      <h3>Creator Upload</h3>
      <form onSubmit={handleUpload} style={{ display: "grid", gap: 10, maxWidth: 520 }}>
        <input value={creatorId} onChange={(e) => setCreatorId(e.target.value)} placeholder="creatorId" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="title" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="description" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="tags (comma separated)" />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit">Upload</button>
      </form>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
    </div>
  );
}
