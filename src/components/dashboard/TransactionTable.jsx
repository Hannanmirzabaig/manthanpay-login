import { getInitials } from "../../utils/dashboardUtils";

function TransactionTable({
  transactions,
  onViewAll,
  search,
  onSearch,
  showSearch = false,
}) {
  return (
    <section className="dashboard-panel transactions-panel">
      <div className="panel-heading transactions-heading">
        <div>
          <h2>
            {showSearch ? "All Transactions" : "Recent Transactions"}
          </h2>

          <p>
            {showSearch
              ? "Search by transaction ID, customer, service or status."
              : "Latest payment activity across your platform."}
          </p>
        </div>

        {showSearch ? (
          <input
            className="table-search"
            type="search"
            placeholder="Filter transactions..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
        ) : (
          <button
            type="button"
            className="text-button"
            onClick={onViewAll}
          >
            View all transactions →
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>TRANSACTION</th>
              <th>CUSTOMER</th>
              <th>SERVICE</th>
              <th>AMOUNT</th>
              <th>STATUS</th>
              <th>DATE</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, index) => (
              <tr key={`${t.id}-${index}`}>
                <td>
                  <span className="transaction-id">{t.id}</span>
                </td>

                <td>
                  <div className="customer-cell">
                    <span className="customer-avatar">
                      {getInitials(t.customer)}
                    </span>
                    <span className="customer-name">{t.customer}</span>
                  </div>
                </td>

                <td>{t.service}</td>
                <td className="amount-cell">{t.amount}</td>

                <td>
                  <span
                    className={`status-badge ${String(
                      t.status
                    ).toLowerCase()}`}
                  >
                    <span className="status-dot" />
                    {t.status}
                  </span>
                </td>

                <td className="date-cell">{t.date}</td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan="6" className="empty-state">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TransactionTable;