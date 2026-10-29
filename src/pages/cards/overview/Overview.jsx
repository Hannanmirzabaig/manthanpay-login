import StatCard from "../../../components/common/StatCard";
import TransactionTable from "../../../components/dashboard/TransactionTable";

function Overview({
  greeting,
  dashboardStats,
  weeklyRevenueData,
  revenueSubtitle,
  revenuePeriod,
  setRevenuePeriod,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  transactions,
  paymentMethodsData,
  onViewAll,
  onExploreReports,
}) {
  return (
    <>
     

      <section className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
          />
        ))}
      </section>

      <section className="analytics-grid">
        {/* REVENUE OVERVIEW */}
        <article className="dashboard-panel revenue-panel">
          <div className="panel-heading">
            <div>
              <h2>Revenue Overview</h2>
              <p>{revenueSubtitle}</p>
            </div>

            <span className="panel-icon">↗</span>
          </div>

          <div className="revenue-summary">
            <div>
              <strong>Revenue overview</strong>
              <span>Based on successful transactions</span>
            </div>

            <div className="revenue-filter-controls">
              <select
                className="revenue-period"
                value={revenuePeriod}
                onChange={(e) => setRevenuePeriod(e.target.value)}
                aria-label="Select revenue period"
              >
                <option value="thisWeek">This Week</option>
                <option value="lastWeek">Last Week</option>
                <option value="custom">Custom Date Range</option>
              </select>

              {revenuePeriod === "custom" && (
                <div className="revenue-date-range">
                  <label>
                    <span>From</span>
                    <input
                      type="date"
                      value={customStartDate}
                      max={customEndDate || undefined}
                      onChange={(e) =>
                        setCustomStartDate(e.target.value)
                      }
                    />
                  </label>

                  <label>
                    <span>To</span>
                    <input
                      type="date"
                      value={customEndDate}
                      min={customStartDate || undefined}
                      onChange={(e) =>
                        setCustomEndDate(e.target.value)
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div
            className="bar-chart"
            style={{
              gridTemplateColumns: `repeat(${Math.max(
                weeklyRevenueData.length,
                1
              )}, ${
                revenuePeriod === "custom" &&
                weeklyRevenueData.length > 7
                  ? "64px"
                  : "minmax(0, 1fr)"
              })`,
            }}
          >
            {weeklyRevenueData.map((item, index) => (
              <div className="bar-column" key={item.day}>
                <div className="bar-value">
                  ₹{item.value.toLocaleString("en-IN")}
                </div>

                <div className="bar-track">
                  <div
                    className={`revenue-bar ${
                      (revenuePeriod === "thisWeek" ||
                        revenuePeriod === "lastWeek") &&
                      index === 5
                        ? "highlight"
                        : ""
                    }`}
                    style={{ height: item.height }}
                  />
                </div>

                <span className="bar-day">{item.day}</span>
              </div>
            ))}

            {weeklyRevenueData.length === 0 && (
              <p className="empty-state">
                {revenuePeriod === "custom" &&
                (!customStartDate || !customEndDate)
                  ? "Select start date and end date to view revenue."
                  : "No revenue data available for this period."}
              </p>
            )}
          </div>
        </article>

        {/* PAYMENT METHODS */}
        <article className="dashboard-panel payment-panel">
          <div className="panel-heading">
            <div>
              <h2>Payment Methods</h2>
              <p>Distribution by payment method</p>
            </div>

            <span className="panel-icon">◉</span>
          </div>

          <div className="payment-total">
            <div className="payment-donut">
              <div className="donut-inner">
                <strong>{transactions.length}</strong>
                <span>Transactions</span>
              </div>
            </div>

            <div className="payment-total-text">
              <strong>Payment channels</strong>
              <span>Based on API transaction data</span>
            </div>
          </div>

          <div className="payment-method-list">
            {paymentMethodsData.map((method) => (
              <div className="method-row" key={method.name}>
                <div className="method-heading">
                  <span>
                    <i className={`method-dot ${method.tone}`} />
                    {method.name}
                  </span>

                  <strong>{method.percent}%</strong>
                </div>

                <div className="progress-track">
                  <div
                    className={`progress-fill ${method.tone}`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(0, method.percent)
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}

            {paymentMethodsData.length === 0 && (
              <p className="empty-state">
                No payment data available.
              </p>
            )}
          </div>
        </article>
      </section>

      <TransactionTable
        transactions={transactions.slice(0, 4)}
        onViewAll={onViewAll}
      />
    </>
  );
}

export default Overview;
