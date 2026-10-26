import { useEffect, useState } from "react";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useConfirm } from "../../components/admin/ConfirmDialog.jsx";
import Modal from "../../components/admin/Modal.jsx";
import PageHeader from "../../components/admin/PageHeader.jsx";
import DataTable from "../../components/admin/DataTable.jsx";
import Badge from "../../components/admin/Badge.jsx";
import { Field, Input, Select } from "../../components/admin/FormControls.jsx";

const EMPTY = { name: "", email: "", password: "", role: "staff" };

function initialsOf(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

export default function UsersAdmin() {
  const { token, user: me } = useAdminAuth();
  const { showToast } = useToast();
  const confirm = useConfirm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    setLoading(true);
    adminApi
      .get("/users", token)
      .then(setUsers)
      .finally(() => setLoading(false));
  }
  useEffect(load, [token]);

  const isSuperadmin = me?.role === "superadmin";

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.post("/users", form, token);
      showToast("Admin user created");
      setModalOpen(false);
      setForm(EMPTY);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(u) {
    try {
      await adminApi.put(`/users/${u._id}`, { isActive: !u.isActive }, token);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  }

  async function handleDelete(u) {
    const ok = await confirm({ title: "Delete admin account?", message: `${u.name} will lose access immediately.`, confirmLabel: "Delete", danger: true });
    if (!ok) return;
    await adminApi.del(`/users/${u._id}`, token);
    showToast("Deleted");
    load();
  }

  const columns = [
    {
      key: "name",
      header: "Name",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center text-xs font-semibold shrink-0">
            {initialsOf(u.name)}
          </div>
          <span className="font-medium text-primary">{u.name}</span>
          {u._id === me?.id && <span className="text-[0.65rem] text-primary/35">(you)</span>}
        </div>
      ),
    },
    { key: "email", header: "Email", render: (u) => <span className="text-primary/60">{u.email}</span> },
    { key: "role", header: "Role", render: (u) => <Badge tone={u.role === "superadmin" ? "accent" : "neutral"}>{u.role}</Badge> },
    { key: "status", header: "Status", render: (u) => <Badge tone={u.isActive ? "success" : "neutral"}>{u.isActive ? "Active" : "Disabled"}</Badge> },
    {
      key: "actions",
      header: "",
      headClassName: "text-right",
      className: "text-right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          {(isSuperadmin || u._id === me.id) && (
            <button onClick={() => toggleActive(u)} className="admin-btn-ghost admin-btn-sm">
              {u.isActive ? "Disable" : "Enable"}
            </button>
          )}
          {isSuperadmin && u._id !== me.id && (
            <button onClick={() => handleDelete(u)} className="admin-icon-btn hover:!text-red-600 hover:!bg-red-50" aria-label="Delete">
              <i className="fa-solid fa-trash-can text-xs" />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Admin Users"
        subtitle={`${users.length} account${users.length === 1 ? "" : "s"} with admin access`}
        actions={
          isSuperadmin && (
            <button onClick={() => setModalOpen(true)} className="admin-btn-primary">
              <i className="fa-solid fa-plus" /> Add Admin
            </button>
          )
        }
      />

      {!isSuperadmin && (
        <div className="flex items-center gap-2.5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-4">
          <i className="fa-solid fa-circle-info" />
          Only superadmins can create or delete admin accounts. You can still manage your own profile.
        </div>
      )}

      <DataTable columns={columns} rows={users} loading={loading} pageSize={10} empty={{ icon: "fa-users-gear", title: "No admin users" }} />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Admin User" subtitle="Grant a teammate access to this dashboard">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Name" required>
            <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Email" required>
            <Input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="Password" required>
            <Input required type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </Field>
          <Field label="Role">
            <Select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}>
              <option value="staff">Staff</option>
              <option value="superadmin">Superadmin</option>
            </Select>
          </Field>
          <button type="submit" disabled={saving} className="admin-btn-primary w-full">
            {saving ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
