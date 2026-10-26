import { useRef, useState } from "react";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { adminApi, imageUrl } from "../../api/client.js";

export default function ImageUploader({ value, onChange, label = "Image", aspect = "aspect-square" }) {
  const { token } = useAdminAuth();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  async function uploadFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please choose an image file");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const { url } = await adminApi.upload(file, token);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    uploadFile(e.dataTransfer.files?.[0]);
  }

  return (
    <div>
      {label && <p className="admin-label">{label}</p>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative w-28 h-28 shrink-0 rounded-2xl border-2 border-dashed overflow-hidden cursor-pointer transition-all duration-200 flex items-center justify-center bg-secondary/40 ${
          dragOver ? "border-accent bg-accent/5 scale-[1.03]" : "border-border hover:border-accent/50"
        } ${aspect}`}
      >
        {value ? (
          <>
            <img src={imageUrl(value)} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-primary/0 hover:bg-primary/50 transition-colors duration-200 flex items-center justify-center group">
              <i className="fa-solid fa-arrows-rotate text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/95 text-red-600 rounded-full text-xs shadow-soft flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors"
              aria-label="Remove image"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </>
        ) : uploading ? (
          <i className="fa-solid fa-spinner fa-spin text-accent" />
        ) : (
          <div className="flex flex-col items-center gap-1.5 text-primary/35 px-2 text-center">
            <i className="fa-solid fa-cloud-arrow-up text-lg" />
            <span className="text-[0.65rem] font-medium">Drop or click</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            uploadFile(e.target.files?.[0]);
            e.target.value = "";
          }}
          disabled={uploading}
        />
      </div>
      {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
