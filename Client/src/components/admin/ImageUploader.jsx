import { useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { adminApi, imageUrl } from "../../api/client.js";

export default function ImageUploader({ value, onChange, label = "Image" }) {
  const { token } = useAdminAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await adminApi.upload(file, token);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <div className="w-20 h-20 rounded-lg bg-secondary border border-border overflow-hidden shrink-0">
          {value && <img src={imageUrl(value)} alt="" className="w-full h-full object-cover" />}
        </div>
        <label className="btn-outline cursor-pointer text-sm">
          {uploading ? "Uploading..." : "Choose file"}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-red-600 hover:underline">
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
