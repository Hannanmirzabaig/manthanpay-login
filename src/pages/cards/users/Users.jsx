import GenericTable from "../../../components/dashboard/GenericTable";

function Users({ users }) {
  return (
    <GenericTable
      title="All Users"
      subtitle="Registered users on the platform"
      columns={[
        { key: "id", label: "User ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "phone", label: "Phone" },
        { key: "status", label: "Status", isStatus: true },
        { key: "date", label: "Joined" },
      ]}
      data={users}
    />
  );
}

export default Users;