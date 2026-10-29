import GenericTable from "../../../components/dashboard/GenericTable";

function Agents({ agents }) {
  return (
    <GenericTable
      title="All Agents"
      subtitle="Active agents and their wallet balance"
      columns={[
        { key: "id", label: "Agent ID" },
        { key: "name", label: "Agent Name" },
        { key: "shop", label: "Shop" },
        { key: "location", label: "Location" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status", isStatus: true },
      ]}
      data={agents}
    />
  );
}

export default Agents;