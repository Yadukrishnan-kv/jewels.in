import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import PageHeader from "../../components/admin/PageHeader.jsx";
import Badge from "../../components/admin/Badge.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx";
import Tabs from "../../components/admin/Tabs.jsx";
import { TableSkeleton } from "../../components/admin/Skeletons.jsx";

const STATUS_TONE = { new: "accent", read: "neutral", archived: "neutral" };

export default function InquiriesAdmin() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  function load() {
    setLoading(true);
    adminApi
      .get("/inquiries", token)
      .then(setInquiries)
      .finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  async function setStatus(id, status) {
    await adminApi.put(`/inquiries/${id}`, { status }, token);
    showToast("Updated");
    load();
  }

  const counts = useMemo(
    () => ({
      all: inquiries.length,
      new: inquiries.filter((i) => i.status === "new").length,
      read: inquiries.filter((i) => i.status === "read").length,
      archived: inquiries.filter((i) => i.status === "archived").length,
    }),
    [inquiries]
  );

  const visible = filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter);

  return (
    <div>
      <PageHeader title="Contact Inquiries" subtitle="Messages submitted through the storefront contact form." />

      <Tabs
        tabs={[
          { value: "all", label: "All", count: counts.all },
          { value: "new", label: "New", count: counts.new },
          { value: "read", label: "Read", count: counts.read },
          { value: "archived", label: "Archived", count: counts.archived },
        ]}
        active={filter}
        onChange={setFilter}
      />

      {loading ? (
        <div className="admin-card">
          <TableSkeleton rows={4} cols={1} />
        </div>
      ) : visible.length === 0 ? (
        <div className="admin-card">
          <EmptyState icon="fa-envelope-open-text" title="No inquiries" message="Nothing matches this filter yet." />
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((i, idx) => (
            <motion.div
              key={i._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              className={`admin-card p-5 relative overflow-hidden ${i.status === "new" ? "border-accent/30" : ""}`}
            >
              {i.status === "new" && <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />}
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div>
                  <p className="font-medium text-primary flex items-center gap-2">
                    {i.name}
                    <span className="text-xs text-primary/35 font-normal">{new Date(i.createdAt).toLocaleDateString()}</span>
                  </p>
                  <p className="text-xs text-primary/50 mt-0.5">
                    {i.phone && <span>{i.phone}</span>}
                    {i.phone && i.email && <span className="mx-1.5">&middot;</span>}
                    {i.email && <span>{i.email}</span>}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[i.status]} dot={i.status === "new"}>
                  {i.status}
                </Badge>
              </div>
              <p className="text-sm text-primary/70 mt-3 leading-relaxed">{i.message}</p>
              <div className="flex gap-4 mt-3.5">
                {i.status !== "read" && (
                  <button onClick={() => setStatus(i._id, "read")} className="text-accent text-xs font-medium hover:underline">
                    Mark read
                  </button>
                )}
                {i.status !== "archived" && (
                  <button onClick={() => setStatus(i._id, "archived")} className="text-primary/45 text-xs font-medium hover:underline">
                    Archive
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
