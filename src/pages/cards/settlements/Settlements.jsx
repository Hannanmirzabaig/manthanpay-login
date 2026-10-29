import GenericTable from "../../../components/dashboard/GenericTable";

function Settlements({ settlements }) {
  return (
    <GenericTable
      title="Settlements"
      subtitle="Agent settlement records"
      columns={[
        { key: "id", label: "Agent ID" },
        { key: "settlementId", label: "Settlement ID" },
        { key: "agent", label: "Agent" },
        { key: "amount", label: "Amount" },
        { key: "status", label: "Status", isStatus: true },
        { key: "date", label: "Date" },
      ]}
      data={settlements}
    />
  );
}

export default Settlements;