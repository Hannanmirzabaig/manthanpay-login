import GenericTable from "../../../components/dashboard/GenericTable";

function MoneyTransfer({ moneyTransfers }) {
  return (
    <GenericTable
      title="Money Transfers"
      subtitle="P2P and agent money transfer history"
      columns={[
        { key: "id", label: "Transaction ID" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status", isStatus: true },
        { key: "date", label: "Date" },
      ]}
      data={moneyTransfers}
    />
  );
}

export default MoneyTransfer;