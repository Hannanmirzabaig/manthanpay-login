import { getInitials } from "../../utils/dashboardUtils";

function GenericTable({ title, subtitle, columns, data }) {
  return (
    <section className="dashboard-panel transactions-panel">
      <div className="panel-heading transactions-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <span className="text-button" style={{ cursor: "default" }}>
          {data.length} records
        </span>
      </div>

      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.isStatus ? (
                      <span
                        className={`status-badge ${String(
                          row[col.key] || ""
                        ).toLowerCase()}`}
                      >
                        <span className="status-dot" />
                        {row[col.key]}
                      </span>
                    ) : col.key === "name" || col.key === "agent" ? (
                      <div className="customer-cell">
                        <span className="customer-avatar">
                          {getInitials(row[col.key])}
                        </span>
                        <span className="customer-name">
                          {row[col.key]}
                        </span>
                      </div>
                    ) : (
                      row[col.key] ?? "-"
                    )}
                  </td>
                ))}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default GenericTable;