
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";
import {
  getDashboardStats,
  getTransactions,
  getUsers,
  getAgents,
  getSettlements,
  getServices,
  getReports,
  getMoneyTransfer,
  getRefunds,
} from "../../services/api";

import "../Dashboard.css";

import SettingPage from "../settings/SettingsPage";
import Overview from "../cards/overview/Overview";

import {
  getInitials,
  getRows,
  buildPaymentMethods,
  buildRevenueData,
} from "../../utils/dashboardUtils";

import Transactions from "../cards/transactions/Transactions";
import Users from "../cards/users/Users";
import Agents from "../cards/agents/Agents";
import Settlements from "../cards/settlements/Settlements";
import Services from "../cards/services/Services";
import Reports from "../cards/reports/Reports";
import MoneyTransfer from "../cards/money-transfer/MoneyTransfer";
import Refundable from "../cards/refundable/Refundable";

import DashboardCards from "../../components/dashboard/DashboardCards";

function filterRows(rows, query) {
  if (!query.trim()) return rows;

  const searchText = query.trim().toLowerCase();

  return rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value ?? "").toLowerCase().includes(searchText)
    )
  );
}

function Dashboard({ onLogout }) {
  // Browser URL based page navigation
  const [searchParams, setSearchParams] = useSearchParams();

  const allowedPages = [
    "Home",
    "Dashboard",
    "Transactions",
    "Users",
    "Agents",
    "Settlements",
    "Services",
    "Reports",
    "Money Transfer",
    "Refundable",
    "Settings",
  ];

  const requestedPage = searchParams.get("page");

  const activePage = allowedPages.includes(requestedPage)
    ? requestedPage
    : "Home";

  const [search, setSearch] = useState("");
  const [now, setNow] = useState(() => new Date());

  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [services, setServices] = useState([]);
  const [reports, setReports] = useState([]);
  const [moneyTransfers, setMoneyTransfers] = useState([]);
  const [refunds, setRefunds] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [revenueTransactions, setRevenueTransactions] = useState([]);
  const [revenuePeriod, setRevenuePeriod] = useState("thisWeek");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [paymentMethodsData, setPaymentMethodsData] = useState([]);

  const [userName] = useState(() => {
    return (
      localStorage.getItem("manthanpayLoggedInUser") || "Admin User"
    );
  });

  // Dashboard page navigation
  const navigateToPage = (page) => {
    if (!allowedPages.includes(page) || page === activePage) return;

    if (page === "Home") {
      setSearchParams({});
    } else {
      setSearchParams({ page });
    }

    setSearch("");
  };

  // Current date and time
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);

    return () => clearInterval(timer);
  }, []);

  // Load dashboard data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);

        const [
          dashboardData,
          txnData,
          usersData,
          agentsData,
          settlementsData,
          servicesData,
          reportsData,
          moneyTransfersData,
          refundsData,
        ] = await Promise.all([
          getDashboardStats(),
          getTransactions(),
          getUsers(),
          getAgents(),
          getSettlements(),
          getServices(),
          getReports(),
          getMoneyTransfer(),
          getRefunds(),
        ]);

        if (!isMounted) return;

        setStats(dashboardData);

        const transactionRows = getRows(txnData);

        setPaymentMethodsData(
          buildPaymentMethods(transactionRows)
        );

        setRevenueTransactions(transactionRows);

        setTransactions(
          transactionRows.map((t) => ({
            id: t.transactionId || t.id || "-",
            customer:
              t.customer || t.userName || t.name || "Unknown",
            service:
              t.paymentMethod || t.type || t.serviceName || "-",
            amount: `₹${Number(t.amount || 0).toLocaleString("en-IN")}`,
            status: t.status || "Pending",
            date: t.createdAt || t.date || "-",
          }))
        );

        setUsers(
          getRows(usersData).map((u) => ({
            id: u.userId || u._id || "-",
            Role: u.role || "-",
            name: u.name || u.fullName || "Unknown",
            email: u.email || "-",
            phone: u.phone || u.mobile || "-",
            status: u.status || "-",
            date: u.date || "-",
          }))
        );

        setAgents(
          getRows(agentsData).map((a) => ({
            id: a.agentId || a._id || "-",
            name: a.name || a.agentName || "Unknown",
            shop: a.shopName || a.shop || "-",
            location: a.location || "-",
            phone: a.phone || a.mobile || "-",
            status: a.status || "-",
          }))
        );

        setSettlements(
          getRows(settlementsData).map((s) => ({
            id: s.agentId || "-",
            agent: s.agentName || s.agent || "-",
            settlementId: s.settlementId || "-",
            amount: `₹${Number(s.amount || 0).toLocaleString("en-IN")}`,
            status: s.status || "-",
            date: s.date || s.createdAt || "-",
          }))
        );

        setServices(
          getRows(servicesData).map((s) => ({
            id: s.serviceId || s._id || "-",
            name: s.name || s.serviceName || "-",
            status: s.status || "Active",
          }))
        );

        setReports(
          getRows(reportsData).map((r) => ({
            id: r.reportId || r._id || "-",
            title: r.title || r.name || "-",
            type: r.reportType || "-",
            status: r.status || "Generated",
            date: r.date || "-",
            totalRecords: r.totalRecords,
          }))
        );

        setMoneyTransfers(
          getRows(moneyTransfersData).map((m) => ({
            id: m.id || m._id || m.transferId || "-",
            from: m.fromUser || m.from || m.sender || "-",
            to: m.toUser || m.to || m.receiver || "-",
            amount: `₹${Number(m.amount || 0).toLocaleString("en-IN")}`,
            status: m.status || "Pending",
            date: m.date || m.createdAt || "-",
          }))
        );

        setRefunds(
          getRows(refundsData).map((r) => ({
            id: r.userId || r._id || "-",
            txnId: r.transactionId || "-",
            amount: `₹${Number(r.amount || 0).toLocaleString("en-IN")}`,
            reason: r.reason || "-",
            status: r.status || "Pending",
            date: r.date || r.createdAt || "-",
          }))
        );
      } catch (err) {
        if (!isMounted) return;

        console.error("Dashboard load error:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Date and time
  const today = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const currentTime = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Greeting
  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  // Revenue chart data
  const weeklyRevenueData = useMemo(
    () =>
      buildRevenueData(
        revenueTransactions,
        revenuePeriod,
        customStartDate,
        customEndDate
      ),
    [
      revenueTransactions,
      revenuePeriod,
      customStartDate,
      customEndDate,
    ]
  );

  const revenueSubtitle =
    revenuePeriod === "lastYear"
      ? "Monthly collection overview"
      : "Daily collection overview";

  // Dashboard statistics
  const dashboardStats = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: "Total Users",
        value: stats.totalUsers?.toLocaleString("en-IN") ?? "0",
        change: "",
        icon: "👥",
        tone: "blue",
      },
      {
        title: "Total Agents",
        value: stats.totalAgents?.toLocaleString("en-IN") ?? "0",
        change: "",
        icon: "🧑",
        tone: "green",
      },
      {
        title: "Total Transactions",
        value: stats.totalTransactions?.toLocaleString("en-IN") ?? "0",
        change: "",
        icon: "↗",
        tone: "violet",
      },
      {
        title: "Successful Txns",
        value: stats.successfulTransactions?.toLocaleString("en-IN") ?? "0",
        change: "",
        icon: "✓",
        tone: "green",
      },
      {
        title: "Failed Txns",
        value: stats.failedTransactions?.toLocaleString("en-IN") ?? "0",
        change: "",
        icon: "!",
        tone: "orange",
      },
      {
        title: "Settlements",
        value: stats.totalSettlements?.toLocaleString("en-IN") ?? "0",
        change: "",
        icon: "₹",
        tone: "blue",
      },
      {
        title: "Money Transfers",
        value: stats.totalMoneyTransfers?.toLocaleString("en-IN") ?? "0",
        change: "",
        icon: "⇄",
        tone: "violet",
      },
      {
        title: "Refunds",
        value: stats.totalRefunds?.toLocaleString("en-IN") ?? "0",
        change: "",
        icon: "↩",
        tone: "orange",
      },
    ];
  }, [stats]);

  // Search only within the current page
  const filteredTransactions = useMemo(
    () => filterRows(transactions, search),
    [transactions, search]
  );

  const filteredUsers = useMemo(
    () => filterRows(users, search),
    [users, search]
  );

  const filteredAgents = useMemo(
    () => filterRows(agents, search),
    [agents, search]
  );

  const filteredSettlements = useMemo(
    () => filterRows(settlements, search),
    [settlements, search]
  );

  const filteredServices = useMemo(
    () => filterRows(services, search),
    [services, search]
  );

  const filteredReports = useMemo(
    () => filterRows(reports, search),
    [reports, search]
  );

  const filteredMoneyTransfers = useMemo(
    () => filterRows(moneyTransfers, search),
    [moneyTransfers, search]
  );

  const filteredRefunds = useMemo(
    () => filterRows(refunds, search),
    [refunds, search]
  );

  return (
    <DashboardLayout
      activePage={activePage}
      onNavigate={navigateToPage}
      onLogout={onLogout}
    >
      {/* HEADER */}
      {activePage !== "Home" && activePage !== "Dashboard" && (
        <header className="dashboard-header">
          <div className="page-heading">
            <div className="breadcrumb">
              MANAGEMENT / {activePage.toUpperCase()}
            </div>

            <h1>{userName}</h1>

            <div className="dashboard-date-time">
              <span>{today}</span>
              <span className="current-time">{currentTime}</span>
            </div>
          </div>

          <div className="header-right">
            <label className="header-search">
              <span>⌕</span>

              <input
                type="search"
                placeholder={`Search ${activePage === "Dashboard" ? "overview" : activePage}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>

            <button
              type="button"
              className="notification-button"
              onClick={() => window.alert("No new notifications.")}
            >
              🔔
              <span className="notification-dot" />
            </button>

            <div className="system-status">
              <span className="live-dot" />
              <span>System Online</span>
            </div>

            <div className="header-avatar">
              {getInitials(userName)}
            </div>
          </div>
        </header>
      )}

      {/* LOADING */}
      {activePage !== "Home" && loading && (
        <section
          className="dashboard-panel"
          style={{ padding: "2rem", textAlign: "center" }}
        >
          <p>Loading dashboard data...</p>
        </section>
      )}

      {/* ERROR */}
      {activePage !== "Home" && error && !loading && (
        <section
          className="dashboard-panel"
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#c0392b",
          }}
        >
          <p>Error: {error}</p>

          <button
            type="button"
            className="primary-button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </section>
      )}

      {/* HOME */}
      {activePage === "Home" && (
        <DashboardCards onNavigate={navigateToPage} />
      )}

      {/* OVERVIEW */}
      {!loading && !error && activePage === "Dashboard" && (
        <Overview
          greeting={greeting}
          dashboardStats={dashboardStats}
          weeklyRevenueData={weeklyRevenueData}
          revenueSubtitle={revenueSubtitle}
          revenuePeriod={revenuePeriod}
          setRevenuePeriod={setRevenuePeriod}
          customStartDate={customStartDate}
          setCustomStartDate={setCustomStartDate}
          customEndDate={customEndDate}
          setCustomEndDate={setCustomEndDate}
          transactions={transactions}
          paymentMethodsData={paymentMethodsData}
          onViewAll={() => navigateToPage("Transactions")}
          onExploreReports={() => navigateToPage("Reports")}
        />
      )}

      {/* TRANSACTIONS */}
      {!loading && !error && activePage === "Transactions" && (
        <Transactions transactions={filteredTransactions} />
      )}

      {/* USERS */}
      {!loading && !error && activePage === "Users" && (
        <Users users={filteredUsers} />
      )}

      {/* AGENTS */}
      {!loading && !error && activePage === "Agents" && (
        <Agents agents={filteredAgents} />
      )}

      {/* SETTLEMENTS */}
      {!loading && !error && activePage === "Settlements" && (
        <Settlements settlements={filteredSettlements} />
      )}

      {/* SERVICES */}
      {!loading && !error && activePage === "Services" && (
        <Services services={filteredServices} />
      )}

      {/* REPORTS */}
      {!loading && !error && activePage === "Reports" && (
        <Reports reports={filteredReports} />
      )}

      {/* MONEY TRANSFER */}
      {!loading && !error && activePage === "Money Transfer" && (
        <MoneyTransfer moneyTransfers={filteredMoneyTransfers} />
      )}

      {/* REFUNDABLE */}
      {!loading && !error && activePage === "Refundable" && (
        <Refundable refunds={filteredRefunds} />
      )}

      {/* SETTINGS */}
      {!loading && !error && activePage === "Settings" && (
        <SettingPage onLogout={onLogout} />
      )}

      {/* FOOTER */}
      <footer className="dashboard-footer">
        <span>© 2026 ManthanPay</span>
        <span>Admin Portal · Secure Payment Management</span>
      </footer>
    </DashboardLayout>
  );
}

export default Dashboard;
