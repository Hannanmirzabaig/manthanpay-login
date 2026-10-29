import GenericTable from "../../../components/dashboard/GenericTable";

function Reports({ reports }) {
  return (
    <GenericTable
      title="Reports"
      subtitle="Generated reports and analytics"
      columns={[
        { key: "id", label: "Report ID" },
        { key: "title", label: "Title" },
        { key: "type", label: "Type" },
        { key: "status", label: "Status", isStatus: true },
        { key: "date", label: "Generated At" },
      ]}
      data={reports}
    />
  );
}

export default Reports;