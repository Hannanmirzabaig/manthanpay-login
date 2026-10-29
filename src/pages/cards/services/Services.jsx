import GenericTable from "../../../components/dashboard/GenericTable";

function Services({ services }) {
  return (
    <GenericTable
      title="Services"
      subtitle="Available payment services"
      columns={[
        { key: "id", label: "Service ID" },
        { key: "name", label: "Service Name" },
        { key: "status", label: "Status", isStatus: true },
      ]}
      data={services}
    />
  );
}

export default Services;