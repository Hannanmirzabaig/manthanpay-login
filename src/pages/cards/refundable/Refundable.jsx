import GenericTable from "../../../components/dashboard/GenericTable";

function Refundable({ refunds }) {
  return (
    <GenericTable
      title="Refunds"
      subtitle="Processed and pending refunds"
      columns={[
        { key: "id", label: "User ID" },
        { key: "txnId", label: "Transaction ID" },
        { key: "amount", label: "Amount" },
        { key: "reason", label: "Reason" },
        { key: "status", label: "Status", isStatus: true },
        { key: "date", label: "Date" },
      ]}
      data={refunds}
    />
  );
}

export default Refundable;