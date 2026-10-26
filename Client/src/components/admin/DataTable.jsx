import { useEffect, useMemo, useState } from "react";
import { TableSkeleton } from "./Skeletons.jsx";
import EmptyState from "./EmptyState.jsx";

export default function DataTable({
  columns,
  rows,
  loading,
  rowKey = (r) => r._id,
  onRowClick,
  pageSize = 10,
  empty = {},
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [rows.length, totalPages, page]);

  const pageRows = useMemo(() => rows.slice((page - 1) * pageSize, page * pageSize), [rows, page, pageSize]);

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={`px-5 py-3.5 text-left text-[0.72rem] font-semibold uppercase tracking-wide text-primary/45 ${c.headClassName || ""}`}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? null : pageRows.length === 0 ? null : (
              pageRows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={`border-b border-border last:border-0 transition-colors duration-150 ${
                    onRowClick ? "cursor-pointer hover:bg-secondary/40" : "hover:bg-secondary/20"
                  }`}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={`px-5 py-3.5 align-middle ${c.className || ""}`}>
                      {c.render ? c.render(row) : row[c.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        {loading && <TableSkeleton cols={columns.length} />}
      </div>

      {!loading && rows.length === 0 && (
        <EmptyState icon={empty.icon || "fa-inbox"} title={empty.title || "No records found"} message={empty.message} action={empty.action} />
      )}

      {!loading && rows.length > pageSize && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-secondary/20">
          <p className="text-xs text-primary/45">
            Showing <span className="font-medium text-primary/70">{(page - 1) * pageSize + 1}</span>–
            <span className="font-medium text-primary/70">{Math.min(page * pageSize, rows.length)}</span> of{" "}
            <span className="font-medium text-primary/70">{rows.length}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="admin-icon-btn disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <span className="text-xs text-primary/55 px-2 font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="admin-icon-btn disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
