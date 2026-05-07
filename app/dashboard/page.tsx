import AuthProvider from "../provider/AuthProvider";

export default function DashboardPage() {
  return (
    <AuthProvider>
      <div>
        <p>Dashboard</p>
      </div>
    </AuthProvider>
  );
}   