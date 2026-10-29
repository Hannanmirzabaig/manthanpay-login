import GenericTable from "../../../components/dashboard/GenericTable";

const columns = [
  { key: "id", label: "Transaction ID" },
  { key: "customer", label: "Customer" },
  { key: "service", label: "Service" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status", isStatus: true },
  { key: "date", label: "Date" },
];

function Transactions({ transactions = [] }) {
  return (
    <GenericTable
      title="All Transactions"
      subtitle="View and monitor all payment transactions."
      columns={columns}
      data={transactions}
    />
  );
}

export default Transactions;