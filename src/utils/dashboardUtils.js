
export function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getRows(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
}

// PAYMENT METHODS: API transaction data se calculate
export function buildPaymentMethods(transactions) {
  const counts = {};

  const methodTones = {
    AEPS: "blue",
    UPI: "green",
    IMPS: "purple",
    "MONEY TRANSFER": "orange",
    NEFT: "teal",
  };

  transactions.forEach((transaction) => {
    const rawName = String(transaction.paymentMethod || "OTHER")
      .trim()
      .toUpperCase()
      .replace(/_/g, " ")
      .replace(/\s+/g, " ");

    const name =
      rawName === "MONEYTRANSFER"
        ? "MONEY TRANSFER"
        : rawName;

    counts[name] = (counts[name] || 0) + 1;
  });

  const total = transactions.length;

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percent: total
        ? Number(((count / total) * 100).toFixed(2))
        : 0,
      tone: methodTones[name] || "blue",
    }))
    .sort((a, b) => b.count - a.count);
}

// API date ko safely parse karna
export function parseTransactionDate(value) {
  if (!value) return null;

  const match = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(
    String(value).trim()
  );

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

// REVENUE: selected period ke successful transactions calculate karna
export function buildRevenueData(
  transactions,
  period,
  customStartDate,
  customEndDate
) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let startDate;
  let endDate;
  let monthly = false;

  if (period === "thisWeek" || period === "lastWeek") {
    const monday = new Date(today);
    const day = monday.getDay();
    monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));

    startDate = new Date(monday);

    if (period === "lastWeek") {
      startDate.setDate(startDate.getDate() - 7);
    }

    endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
  } else if (period === "custom") {
    if (!customStartDate || !customEndDate) return [];

    startDate = new Date(`${customStartDate}T00:00:00`);
    endDate = new Date(`${customEndDate}T00:00:00`);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime()) ||
      startDate > endDate
    ) {
      return [];
    }
  } else {
    return [];
  }

  const buckets = [];

  if (monthly) {
    for (let month = 0; month < 12; month += 1) {
      const date = new Date(startDate.getFullYear(), month, 1);

      buckets.push({
        key: `${date.getFullYear()}-${date.getMonth()}`,
        day: date.toLocaleDateString("en-IN", { month: "short" }),
        value: 0,
      });
    }
  } else {
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      const date = new Date(cursor);

      const dayLabel =
        period === "thisWeek" || period === "lastWeek"
          ? date.toLocaleDateString("en-IN", { weekday: "short" })
          : date.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            });

      buckets.push({
        key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        day: dayLabel,
        value: 0,
      });

      cursor.setDate(cursor.getDate() + 1);
    }
  }

  transactions.forEach((transaction) => {
    const status = String(transaction.status || "").toUpperCase();

    if (
      !["SUCCESS", "SUCCESSFUL", "COMPLETED", "SETTLED"].includes(status)
    ) {
      return;
    }

    const transactionDate = parseTransactionDate(
      transaction.createdAt || transaction.date
    );

    if (!transactionDate) return;

    transactionDate.setHours(0, 0, 0, 0);

    if (transactionDate < startDate || transactionDate > endDate) {
      return;
    }

    const key = monthly
      ? `${transactionDate.getFullYear()}-${transactionDate.getMonth()}`
      : `${transactionDate.getFullYear()}-${transactionDate.getMonth()}-${transactionDate.getDate()}`;

    const bucket = buckets.find((item) => item.key === key);

    if (bucket) {
      const amount = Number(transaction.amount || 0);

      if (Number.isFinite(amount)) {
        bucket.value += amount;
      }
    }
  });

  const maxRevenue = Math.max(...buckets.map((item) => item.value), 0);

  return buckets.map((item) => ({
    day: item.day,
    value: item.value,
    height:
      maxRevenue === 0
        ? "0%"
        : `${Math.max(5, (item.value / maxRevenue) * 100)}%`,
  }));
}
