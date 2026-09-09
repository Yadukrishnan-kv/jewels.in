import { useEffect, useState } from "react";
import { adminApi } from "../../api/client.js";
import { useAdminAuth } from "../../context/AdminAuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import Modal from "../../components/admin/Modal.jsx";

const EMPTY = { name: "", email: "", password: "", role: "staff" };

export default function UsersAdmin() {
  const { token, user: me } = useAdminAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  function load() {
    adminApi.get("/users", token).then(setUsers);
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

  async function handleDelete(id) {
    if (!confirm("Delete this admin user?")) return;
    await adminApi.del(`/users/${id}`, token);
    showToast("Deleted");
    load();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Admin Users</h1>
        {isSuperadmin && (
          <button onClick={() => setModalOpen(true)} className="btn-primary">
            <i className="fa-solid fa-plus" /> Add Admin
          </button>
        )}
      </div>

      {!isSuperadmin && (
        <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          Only superadmins can create or delete admin accounts. You can still edit your own profile.
        </p>
      )}

      <div className="bg-white border border-border rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary text-left">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-border">
                <td className="px-4 py-2 font-medium">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 capitalize">{u.role}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${u.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {u.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  {(isSuperadmin || u._id === me.id) && (
                    <button onClick={() => toggleActive(u)} className="text-accent text-xs hover:underline mr-3">
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  )}
                  {isSuperadmin && u._id !== me.id && (
                    <button onClick={() => handleDelete(u._id)} className="text-red-600 text-xs hover:underline">
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Admin User">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm" />
          <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} className="w-full border border-border rounded-lg px-4 py-2.5 text-sm">
            <option value="staff">Staff</option>
            <option value="superadmin">Superadmin</option>
          </select>
          <button type="submit" disabled={saving} className="btn-primary w-full justify-center">{saving ? "Creating..." : "Create Admin"}</button>
        </form>
      </Modal>
    </div>
  );
}
