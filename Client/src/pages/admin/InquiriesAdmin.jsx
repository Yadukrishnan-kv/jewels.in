import { useEffect, useState } from "react";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export default function InquiriesAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState([]);

  function load() {
    adminApi.get("/inquiries", token).then(setInquiries);
  }
  useEffect(load, [token]);

  async function setStatus(id, status) {
    await adminApi.put(`/inquiries/${id}`, { status }, token);
    showToast("Updated");
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Contact Inquiries</h1>
      <div className="space-y-3">
        {inquiries.length === 0 && <p className="text-primary/50">No inquiries yet.</p>}
        {inquiries.map((i) => (
          <div key={i._id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div>
                <p className="font-medium">{i.name}</p>
                <p className="text-xs text-primary/50">{i.phone} {i.email}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full capitalize ${i.status === "new" ? "bg-accent/10 text-accent" : "bg-secondary text-primary/50"}`}>
                {i.status}
              </span>
            </div>
            <p className="text-sm text-primary/70 mt-3">{i.message}</p>
            <div className="flex gap-3 mt-3">
              {i.status !== "read" && (
                <button onClick={() => setStatus(i._id, "read")} className="text-accent text-xs hover:underline">Mark read</button>
              )}
              {i.status !== "archived" && (
                <button onClick={() => setStatus(i._id, "archived")} className="text-primary/50 text-xs hover:underline">Archive</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
